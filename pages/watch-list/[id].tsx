/* eslint-disable no-loops/no-loops */
/* eslint-disable no-plusplus */
import clsx from 'clsx';
import dayjs from 'dayjs';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { useEffect, useMemo, useState } from 'react';

import Button from '../../components/button';
import CopyLink from '../../components/copyLink';
import MetaTags from '../../components/metaTags';
import Modal from '../../components/modal';
import Navigation from '../../components/navigation';
import Spinner from '../../components/spinner';
import Typography from '../../components/typography';
import TagInput from '../../components/watch-lists/tagInput';
import WatchListVisibility from '../../components/watch-lists/watchListVisibility';
import { useAuth } from '../../context/AuthUserContext';
import getMovieDetails from '../../endpoints/TMDB/getMovie';
import getTVDetails from '../../endpoints/TMDB/tv/getTvDetails';
import getUserByUid from '../../endpoints/user/getUserByUid';
import getWatchList from '../../endpoints/watchlist/getWatchList';
import updateWatchList from '../../endpoints/watchlist/updateWatchList';
import { MovieDetails } from '../../models/TMDB';
import { TVDetails } from '../../models/TMDB/tv';
import { User } from '../../models/user';
import { WatchList } from '../../models/watchlist';
import formatTitleUrl from '../../utils/formatTitleUrl';
import imageUrl from '../../utils/imageUrl';

interface Props {
  watchList: WatchList | null;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const { id } = ctx.query;

    if (!id || typeof id !== 'string') {
      throw new Error(`watchList broken: ${id}`);
    }

    return {
      redirect: {
        destination: `https://tmrev.io/watch-list/${id}`,
        permanent: true,
      },
    };

    // if (cookies.token) {
    //   const { res, err } = await getWatchList(id, cookies.token);

    //   if (res) {
    //     watchList = { ...res.data };
    //   }

    //   if (err) {
    //     throw err;
    //   }
    // } else {
    //   const { res, err } = await getWatchList(id, undefined);

    //   if (res) {
    //     watchList = { ...res.data };
    //   }

    //   if (err) {
    //     throw err;
    //   }
    // }

    // return {
    //   props: {
    //     watchList,
    //   },
    // };
  } catch (error) {
    // Logger.error(error);

    return {
      props: {
        watchList: null,
      },
    };
  }
};

export const WatchListPage: NextPage<Props> = ({ watchList }: Props) => {
  // const [watchList, setWatchLists] = useState<WatchList | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [creator, setCreator] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const { authUser } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const toggleClass = ' transform translate-x-5 bg-dark-component';
  const [toggle, setToggle] = useState(watchList?.public);
  const [removedWatchListItems, setRemovedWatchListItems] = useState<string[]>(
    [],
  );
  const [list, setList] = useState<(MovieDetails | TVDetails)[]>([]);
  const [title, setTitle] = useState(watchList?.title || '');
  const [description, setDescription] = useState(watchList?.description || '');

  useEffect(() => {
    if (!watchList) return;
    setTitle(watchList.title);
    setDescription(watchList.description);
    setToggle(watchList.public);
    setTags(watchList.tags);
  }, [watchList]);

  const watchListId = useMemo(() => {
    if (typeof router.query.id === 'string') return router.query.id;

    return null;
  }, [router.query]);

  const handleRemoveMovies = (id: string) => {
    if (removedWatchListItems.includes(id)) {
      const index = removedWatchListItems.findIndex((value) => value === id);

      const newArray = [...removedWatchListItems];

      newArray.splice(index, 1);

      setRemovedWatchListItems(newArray);
    } else {
      setRemovedWatchListItems((prevState) => [...prevState, id]);
    }
  };

  const handleFetchMovies = async () => {
    if (watchList) {
      watchList.movies.forEach(async (id) => {
        const { res, err } = await getMovieDetails(id.toString());
        if (res) {
          res.data.media_type = 'movie';
          setList((prevState) => [...prevState, res.data]);
        }
        if (err) {
          const { res: tvDetails } = await getTVDetails(id);
          if (tvDetails) {
            tvDetails.data.media_type = 'tv';
            setList((prevState) => [...prevState, tvDetails.data]);
          }
        }
      });
    }
  };

  const submitUpdate = async () => {
    if (!watchList || !authUser) return;

    const newArray = [...list];

    removedWatchListItems.forEach((id) => {
      const index = newArray.findIndex((movie) => movie.id.toString() === id);

      newArray.splice(index, 1);
    });

    const payload = {
      description,
      movies: newArray.map((movie) => movie.id),
      public: toggle || false,
      tags,
      title,
      userId: authUser.uid,
    };

    const token = await authUser.getIdToken(true);

    const { res } = await updateWatchList(payload, token, watchList._id);

    if (res) {
      // setWatchLists(res.data);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!watchList) return;
    if (watchList.movies.length <= list.length) return;
    handleFetchMovies();
  }, [watchList]);

  useEffect(() => {
    if (!watchListId) return;
    setIsLoading(true);

    if (!authUser) {
      getWatchList(watchListId, undefined).then(({ res, err }) => {
        if (res) {
          // setWatchLists(res.data);

          getUserByUid(res.data.userId).then(({ res: userRes }) => {
            if (userRes) {
              setCreator(userRes?.data);
            }
          });

          setError('');
          setIsLoading(false);
        }
        if (err) {
          setError(err.response.data);
          setIsLoading(false);
        }
      });
      return;
    }

    authUser.getIdToken(true).then((authToken) => {
      getWatchList(watchListId, authToken).then(({ res }) => {
        if (res) {
          // setWatchLists(res.data);
          setError('');
        }
      });
    });

    setIsLoading(false);
  }, [authUser, watchListId]);

  const renderWatchList = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((value) => (
        <button
          key={value.id}
          className="grid lg:grid-cols-2 h-max lg:h-96 overflow-hidden grid-rows-2 gap-2 lg:gap-4 text-left bg-dark-components hover:bg-dark-light text-dark-text p-4 rounded"
          type="button"
          onClick={() => router.push(
            `/${value.media_type}/${formatTitleUrl(
              value.media_type === 'movie' ? value.title : value.name,
              value.id,
            )}`,
          )}
        >
          <div className="h-56 w-full relative">
            <Image
              alt={value.media_type === 'movie' ? value.title : value.name}
              className="rounded shadow"
              height="400"
              layout="fill"
              objectFit="cover"
              src={`${imageUrl(300)}${value.poster_path}`}
              width="235"
            />
          </div>
          <div className="flex flex-col">
            <Typography
              className=" text-left md:text-center"
              title={value.media_type === 'movie' ? value.title : value.name}
              variant="h2"
            >
              {value.media_type === 'movie' ? value.title : value.name}
            </Typography>
            <div className="w-full max-h-20 lg:max-h-44">
              <Typography title={value.overview} variant="light">
                {value.overview}
              </Typography>
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-screen w-full justify-center items-center text-dark-text">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>WatchList | Private</title>
          <meta content={error} name="description" />
        </Head>
        <Navigation />
        <div className="text-dark-text flex justify-center items-center space-y-5 flex-col text-center">
          <Typography>{error}</Typography>
          <Button onClick={() => router.push('/login')}>
            <Typography>Login</Typography>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags
        description={watchList?.description || ''}
        title={watchList?.title || ''}
        url={router.asPath}
      />
      <Navigation />
      <div className="mb-4 text-dark-text bg-dark-background sticky  top-16  z-30 px-2 lg:px-8 py-4 ">
        <div className="flex items-center space-x-2">
          <Typography variant="h1">
            WatchList |
            {watchList?.title}
          </Typography>
          {authUser && authUser.uid === watchList?.userId && (
            <>
              <WatchListVisibility visible={watchList?.public} />
              <button
                className="flex items-center justify-center p-2 rounded-full hover:bg-dark-light"
                type="button"
                onClick={() => setOpen(true)}
              >
                <span className="material-icons-outlined">edit</span>
              </button>
            </>
          )}
          {watchList?.public && <CopyLink link={router.asPath} />}
        </div>
        <Typography variant="subtitle">{watchList?.description}</Typography>
        {creator && creator.displayName && (
          <Typography variant="legal">{`Created By - ${creator.displayName}`}</Typography>
        )}
        {watchList && (
          <Typography variant="legal">
            {`Last Updated - ${dayjs(
              watchList.updated_at._seconds * 1000,
            ).format('MMMM, DD YYYY')}`}
          </Typography>
        )}
      </div>
      <div className="lg:px-8 text-dark-text">{renderWatchList()}</div>
      <Modal open={open} setOpen={setOpen}>
        <div className="text-dark-text mx-4 space-y-5">
          <div>
            <Typography className="mb-3" variant="h3">
              Title
            </Typography>
            <input
              className="p-2 rounded bg-dark-components w-full"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </div>
          <div>
            <Typography className="mb-3" variant="h3">
              Description
            </Typography>
            <textarea
              className="p-2 rounded bg-dark-components w-full"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </div>
          <div>
            <Typography className="mb-3" variant="h3">
              Tags
            </Typography>
            <TagInput setTags={setTags} tags={tags} />
          </div>
          <div>
            <div className="flex flex-col">
              <Typography className="mb-3" variant="h3">
                {!toggle ? 'Private' : 'Public'}
              </Typography>
              <button
                className={clsx(
                  'md:w-14 md:h-7 w-12 h-6 flex items-center rounded-full p-1',
                  !toggle ? ' bg-dark-components' : ' bg-dark-light',
                )}
                type="button"
                onClick={() => {
                  setToggle(!toggle);
                }}
              >
                {/* Switch */}
                <div
                  className={`bg-black md:w-6 md:h-6 h-5 w-5 bg-dark-background rounded-full shadow-md transform duration-300 ease-in-out${
                    !toggle ? null : toggleClass
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-80 overflow-auto">
            {list.map((media) => (
              <div
                key={media.id}
                className="bg-dark-components p-2 rounded flex items-center"
              >
                <Typography
                  className={clsx(
                    'flex-grow',
                    removedWatchListItems.includes(media.id.toString())
                      && 'line-through',
                  )}
                >
                  {media.media_type === 'movie' ? media.title : media.name}
                </Typography>
                <button
                  className={clsx(
                    'flex items-center justify-center p-2 hover:bg-dark-light rounded-full',
                    'transition-all duration-100',
                  )}
                  type="button"
                  onClick={() => handleRemoveMovies(media.id.toString())}
                >
                  <span className="material-icons-outlined ">
                    {removedWatchListItems.includes(media.id.toString())
                      ? 'undo'
                      : 'delete'}
                  </span>
                </button>
              </div>
            ))}
          </div>
          <Button
            className="w-full text-center text-dark-background"
            variant="primary"
            onClick={submitUpdate}
          >
            <span className="material-icons-outlined mr-3">sync_alt</span>
            <Typography variant="h4">Update Watchlist</Typography>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default WatchListPage;

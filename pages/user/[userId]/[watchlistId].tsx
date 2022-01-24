import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Navigation from '../../../components/navigation';
import Typography from '../../../components/typography';
import { useAuth } from '../../../context/AuthUserContext';
import getWatchList from '../../../endpoints/watchlist/getWatchList';
import { CreateWatchList, WatchList } from '../../../models/watchlist';
import Image from 'next/image';
import dayjs from 'dayjs';
import MoviePosterRating from '../../../components/watch-lists/moviePosterRating';
import { User } from '../../../models/user';
import getUserByUid from '../../../endpoints/user/getUserByUid';
import Button from '../../../components/button';
import { NextPage } from 'next/types';
import Spinner from '../../../components/spinner';
import WatchListVisibility from '../../../components/watch-lists/watchListVisibility';
import Modal from '../../../components/modal';
import clsx from 'clsx';
import updateWatchList from '../../../endpoints/watchlist/updateWatchList';

export const WatchListPage: NextPage = () => {
  const [watchList, setWatchLists] = useState<WatchList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [creator, setCreator] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const { authUser } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const toggleClass = ' transform translate-x-5 bg-dark-component';
  const [toggle, setToggle] = useState(watchList?.public);
  const [removedWatchListItems, setRemovedWatchListItems] = useState<string[]>(
    []
  );
  const [title, setTitle] = useState(watchList?.title || '');
  const [description, setDescription] = useState(watchList?.description || '');

  useEffect(() => {
    if (!watchList) return;
    setTitle(watchList.title);
    setDescription(watchList.description);
    setToggle(watchList.public);
  }, [watchList]);

  const userId = useMemo(() => router.query.userId as string, [router.query]);
  const watchListId = useMemo(
    () => router.query.watchlistId as string,
    [router.query]
  );

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

  const submitUpdate = async () => {
    console.log(watchList, title, description, authUser, toggle);
    if (!watchList || !authUser) return;

    const newArray = [...watchList.movies];

    removedWatchListItems.forEach((id) => {
      const index = newArray.findIndex((movie) => movie.imdbId === id);

      newArray.splice(index, 1);
    });

    const payload: any = {
      title,
      description,
      public: toggle,
      movies: newArray,
    };

    const token = await authUser.getIdToken(true);

    await updateWatchList(payload, token, watchList._id);

    const { res } = await getWatchList(watchList._id, token);

    if (res) {
      setWatchLists(res.data);
    }

    setOpen(false);
  };

  useEffect(() => {
    if (!userId) return;

    getUserByUid(userId).then(({ res }) => {
      if (res) {
        setCreator(res.data);
      }
    });
  }, [userId]);

  useEffect(() => {
    if (!userId || !watchListId) return;
    setIsLoading(true);

    if (!authUser) {
      getWatchList(watchListId, undefined, userId).then(({ res, err }) => {
        if (res) {
          setWatchLists(res.data);
          setError('');
          setIsLoading(false);
        }
        if (err) {
          setError((err as any).response.data);
          setIsLoading(false);
        }
      });
      return;
    }

    authUser.getIdToken(true).then((authToken) => {
      getWatchList(watchListId, authToken).then(({ res }) => {
        if (res) {
          setWatchLists(res.data);
          setError('');
        }
      });
    });

    setIsLoading(false);
  }, [authUser, userId, watchListId]);

  const renderWatchList = () => {
    return (
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
        {watchList?.movies.map((value) => {
          return (
            <button
              onClick={() =>
                router.push(
                  `/movies/${value.title}?year=${value.year}&imdbuuid=${value.imdbId}`
                )
              }
              key={value.imdbId}
              className='flex lg:flex-row flex-col text-left bg-dark-components hover:bg-dark-light text-dark-text p-4 rounded'>
              <div className='lg:mr-8 mr-0 flex w-full items-center justify-center'>
                <Image
                  className='rounded shadow'
                  alt={watchList.title}
                  objectFit='cover'
                  height='400'
                  width='235'
                  src={value.poster}
                />
              </div>
              <div className='flex flex-col'>
                <Typography
                  className=' text-left md:text-center'
                  title={value.title}
                  variant='h2'>
                  {value.title}
                </Typography>
                <MoviePosterRating user={creator} ratings={value.rating} />
                <Typography title={value.description} variant='light'>
                  {value.description}
                </Typography>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className='flex h-screen w-full justify-center items-center text-dark-text'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>{`WatchList | Private`}</title>
          <meta name='description' content={error} />
        </Head>
        <Navigation />
        <div className='text-dark-text flex justify-center items-center space-y-5 flex-col text-center'>
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
      <Head>
        <title>{`WatchList | ${watchList?.title}`}</title>
        <meta name='description' content={watchList?.description} />
      </Head>
      <Navigation />
      <div className='mb-4 text-dark-text bg-dark-background sticky  top-16  z-30 px-2 lg:px-8 py-4 '>
        <div className='flex items-center space-x-2'>
          <Typography variant='h1'>WatchList | {watchList?.title}</Typography>
          <WatchListVisibility visible={watchList?.public} />
          <button
            onClick={() => setOpen(true)}
            className='flex items-center justify-center p-2 rounded-full hover:bg-dark-light'>
            <span className='material-icons-outlined'>edit</span>
          </button>
        </div>
        <Typography variant='subtitle'>{watchList?.description}</Typography>
        {creator && creator.displayName && (
          <Typography variant='legal'>{`Created By - ${creator.displayName}`}</Typography>
        )}
        {watchList && (
          <Typography variant='legal'>
            {`Last Updated - ${dayjs(
              watchList.updated_at._seconds * 1000
            ).format('MMMM, DD YYYY')}`}
          </Typography>
        )}
      </div>
      <div className='lg:px-8 text-dark-text'>{renderWatchList()}</div>
      <Modal open={open} setOpen={setOpen}>
        <div className='text-dark-text mx-4 space-y-5'>
          <div>
            <Typography className='mb-3' variant='h3'>
              Title
            </Typography>
            <input
              onChange={(e) => setTitle(e.currentTarget.value)}
              className='p-2 rounded bg-dark-components w-3/5'
              value={title}
            />
          </div>
          <div>
            <Typography className='mb-3' variant='h3'>
              Description
            </Typography>
            <textarea
              onChange={(e) => setDescription(e.currentTarget.value)}
              className='p-2 rounded bg-dark-components w-3/5'
              value={description}
              rows={4}
            />
          </div>
          <div>
            <div className='flex flex-col'>
              <Typography className='mb-3' variant='h3'>
                {!toggle ? 'Private' : 'Public'}
              </Typography>
              <button
                className={clsx(
                  'md:w-14 md:h-7 w-12 h-6 flex items-center rounded-full p-1',
                  !toggle ? ' bg-dark-components' : ' bg-dark-light'
                )}
                onClick={() => {
                  setToggle(!toggle);
                }}>
                {/* Switch */}
                <div
                  className={
                    'bg-black md:w-6 md:h-6 h-5 w-5 bg-dark-background rounded-full shadow-md transform duration-300 ease-in-out' +
                    (!toggle ? null : toggleClass)
                  }></div>
              </button>
            </div>
          </div>
          <div className='space-y-2 max-h-80 ß  overflow-auto'>
            {watchList?.movies.map((movies) => (
              <div
                className='bg-dark-components p-2 rounded flex items-center'
                key={movies.imdbId}>
                <Typography
                  className={clsx(
                    'flex-grow',
                    removedWatchListItems.includes(movies.imdbId) &&
                      'line-through'
                  )}>
                  {movies.title}
                </Typography>
                <button
                  onClick={() => handleRemoveMovies(movies.imdbId)}
                  className={clsx(
                    'flex items-center justify-center p-2 hover:bg-dark-light rounded-full',
                    'transition-all duration-100'
                  )}>
                  <span className='material-icons-outlined '>
                    {removedWatchListItems.includes(movies.imdbId)
                      ? 'undo'
                      : 'delete'}
                  </span>
                </button>
              </div>
            ))}
          </div>
          <Button
            onClick={submitUpdate}
            className='w-full text-center text-dark-background'
            variant='primary'>
            <span className='material-icons-outlined mr-3'>sync_alt</span>
            <Typography variant='h4'>Update Watchlist</Typography>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default WatchListPage;

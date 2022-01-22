import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Navigation from '../../../components/navigation';
import Typography from '../../../components/typography';
import { useAuth } from '../../../context/AuthUserContext';
import getWatchList from '../../../endpoints/watchlist/getWatchList';
import { WatchList } from '../../../models/watchlist';
import Image from 'next/image';
import dayjs from 'dayjs';
import MoviePosterRating from '../../../components/watch-lists/moviePosterRating';
import { User } from '../../../models/user';
import getUserByUid from '../../../endpoints/user/getUserByUid';
import Button from '../../../components/button';
import { NextPage } from 'next/types';
import Spinner from '../../../components/spinner';
import WatchListVisibility from '../../../components/watch-lists/watchListVisibility';

export const WatchListPage: NextPage = () => {
  const [watchList, setWatchLists] = useState<WatchList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [creator, setCreator] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const { authUser } = useAuth();
  const router = useRouter();

  const userId = useMemo(() => router.query.userId as string, [router.query]);
  const watchListId = useMemo(
    () => router.query.watchlistId as string,
    [router.query]
  );

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
    </>
  );
};

export default WatchListPage;

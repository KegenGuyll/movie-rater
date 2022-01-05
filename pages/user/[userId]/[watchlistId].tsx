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

const WatchList = () => {
  const [watchList, setWatchLists] = useState<WatchList | null>(null);
  const { authUser } = useAuth();
  const router = useRouter();

  const userId = useMemo(() => router.query.userId as string, [router.query]);
  const watchListId = useMemo(
    () => router.query.watchlistId as string,
    [router.query]
  );

  useEffect(() => {
    if (!userId || !watchListId) return;

    if (!authUser) {
      getWatchList(watchListId, undefined, userId).then(({ res }) => {
        if (res) {
          setWatchLists(res.data);
        }
      });
      return;
    }

    authUser.getIdToken(true).then((authToken) => {
      getWatchList(watchListId, authToken).then(({ res }) => {
        if (res) {
          setWatchLists(res.data);
        }
      });
    });
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
              <div className='lg:mr-8 mr-0'>
                <Image
                  className='rounded shadow'
                  alt={watchList.title}
                  objectFit='cover'
                  layout='fixed'
                  height='400'
                  width='235'
                  src={value.poster}
                />
              </div>
              <div className='flex flex-col'>
                <Typography title={value.title} variant='h2'>
                  {value.title}
                </Typography>
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

  return (
    <>
      <Head>
        <title>{`WatchList | ${watchList?.title}`}</title>
        <meta name='description' content={watchList?.description} />
      </Head>
      <Navigation />
      <div className='mb-4 text-dark-text bg-dark-background sticky  top-16  z-40 lg:px-8 py-4 '>
        <Typography variant='h1'>WatchList | {watchList?.title}</Typography>
        <Typography variant='subtitle'>{watchList?.description}</Typography>
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

export default WatchList;

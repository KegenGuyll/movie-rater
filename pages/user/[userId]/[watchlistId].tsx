import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Navigation from '../../../components/navigation';
import Typography from '../../../components/typography';
import { useAuth } from '../../../context/AuthUserContext';
import getWatchList from '../../../endpoints/watchlist/getWatchList';
import { WatchList } from '../../../models/watchlist';
import Image from 'next/image';

const WatchList = () => {
  const [watchList, setWatchLists] = useState<WatchList | null>(null);
  const { authUser } = useAuth();
  const router = useRouter();

  const userId = useMemo(() => router.query.userId as string, [router.query]);
  const watchListId = useMemo(
    () => router.query.watchlistId as string,
    [router.query]
  );

  console.log(router.query.userId);

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
      <div className='flex flex-wrap justify-center'>
        {watchList?.movies.map((value) => {
          return (
            <button key={value.imdbId}>
              <div className='flex flex-col items-center justify-center text-left bg-dark-components p-4 rounded text-dark-text'>
                <div className='my-4 shadow'>
                  <Image
                    className='rounded shadow'
                    alt={watchList.title}
                    objectFit='cover'
                    src={value.poster}
                    width={126}
                    height={126}
                  />
                </div>
                <Typography
                  title={value.title}
                  className='truncate'
                  variant='h4'>
                  {value.title}
                </Typography>
                <Typography title={value.description} variant='subtitle'>
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
        <title>WatchList | User</title>
        <meta name='description' content='View and Create movie watchlists' />
      </Head>
      <Navigation />
      <div className='lg:px-4'>{renderWatchList()}</div>
    </>
  );
};

export default WatchList;

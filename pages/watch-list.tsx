import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../components/button';
import Navigation from '../components/navigation';
import Typography from '../components/typography';
import PreviewPoster from '../components/watch-lists/previewPoster';
import { useAuth } from '../context/AuthUserContext';
import getAllWatchLists from '../endpoints/watchlist/getAllWatchLists';
import { WatchList } from '../models/watchlist';

const WatchList = () => {
  const [watchList, setWatchLists] = useState<WatchList[] | null>(null);
  const { authUser } = useAuth();
  const router = useRouter();

  const totalMovies = () => {
    let movies = 0;

    watchList?.forEach((el) => {
      movies += el.movies.length;
    });

    return movies;
  };

  useEffect(() => {
    if (!authUser) return;

    authUser.getIdToken(true).then((authToken) => {
      getAllWatchLists(authToken).then(({ res }) => {
        if (res) {
          setWatchLists(res.data);
        }
      });
    });
  }, [authUser]);

  const renderWatchList = () => {
    if (!authUser) {
      return (
        <div className='text-dark-text flex justify-center items-center space-y-5 flex-col text-center'>
          <Typography>You must Login to create a watch list</Typography>
          <Button onClick={() => router.push('/login')}>
            <Typography>Login</Typography>
          </Button>
        </div>
      );
    }

    return (
      <div className='flex flex-wrap justify-evenly'>
        {watchList?.map((value) => {
          return <PreviewPoster key={value._id} watchList={value} />;
        })}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>WatchList | {`${authUser?.displayName}` || 'User'}</title>
        <meta name='description' content='View and Create movie WatchLists' />
      </Head>
      <Navigation />
      <div className='px-2 lg:px-4 text-dark-text'>
        {authUser && (
          <div className='mb-4'>
            <Typography variant='h1'>
              {`${authUser?.displayName}'s | WatchList`}
            </Typography>
            <Typography variant='subtitle'>
              {`${watchList?.length} WatchLists | ${totalMovies()} Movies`}
            </Typography>
          </div>
        )}
        {renderWatchList()}
      </div>
    </>
  );
};

export default WatchList;

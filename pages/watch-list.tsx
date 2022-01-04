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
      <div className='flex flex-wrap justify-center'>
        {watchList?.map((value) => {
          return <PreviewPoster key={value._id} watchList={value} />;
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

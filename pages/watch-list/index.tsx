import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useEffect, useState } from 'react';

import Button from '../../components/button';
import Navigation from '../../components/navigation';
import Typography from '../../components/typography';
import PreviewPoster from '../../components/watch-lists/previewPoster';
import SearchWatchList from '../../components/watch-lists/searchWatchList';
import { useAuth } from '../../context/AuthUserContext';
import getAllWatchLists from '../../endpoints/watchlist/getAllWatchLists';
import { WatchListSearch } from '../../endpoints/watchlist/searchWatchList';
import { WatchList } from '../../models/watchlist';

interface Props { }

export async function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://tmrev.io',
      permanent: true,
    },
  };
}

const WatchListComponent: FunctionComponent<Props> = () => {
  const [watchList, setWatchLists] = useState<WatchList[] | null>(null);
  const [searchResults, setSearchResults] = useState<WatchListSearch[]>();
  const { authUser } = useAuth();
  const router = useRouter();

  const totalMovies = () => {
    let movies = 0;

    watchList?.forEach((el) => {
      movies += el.movies.length;
    });

    return movies;
  };

  const resultTotalMovies = () => {
    let movies = 0;

    if (searchResults) {
      searchResults.forEach((el) => {
        movies += el.movies.length;
      });

      return movies;
    }

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
        <div className="text-dark-text flex justify-center items-center space-y-5 flex-col text-center">
          <Typography>You must Login to create a watch list</Typography>
          <Button onClick={() => router.push('/login')}>
            <Typography>Login</Typography>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-center w-full">
        {watchList?.map((value) => (
          <div key={value._id} className="flex items-center justify-center">
            <PreviewPoster watchList={value} />
          </div>
        ))}
      </div>
    );
  };

  const renderResultWatchList = () => {
    if (!searchResults) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-center w-full">
        {searchResults?.map((value) => (
          <div key={value._id} className="flex items-center justify-center">
            <PreviewPoster watchList={value} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>
          WatchList |
          {`${authUser?.displayName}` || 'User'}
        </title>
        <meta content="View and Create movie WatchLists" name="description" />
      </Head>
      <Navigation />
      <div className="px-2 lg:px-4 text-dark-text">
        <div className="mb-4 space-y-4">
          <Typography variant="h1">Search for WatchLists</Typography>
          {searchResults && !!searchResults.length && (
            <Typography variant="subtitle">
              {`${
                searchResults.length
              } Results | ${resultTotalMovies()} Movies`}
            </Typography>
          )}
          <SearchWatchList setSearchResults={setSearchResults} />
          {renderResultWatchList()}
        </div>
        {authUser && (
          <div className="mb-4">
            <Typography variant="h1">
              {`${authUser?.displayName}'s | WatchList`}
            </Typography>
            <Typography variant="subtitle">
              {`${watchList?.length} WatchLists | ${totalMovies()} Movies`}
            </Typography>
          </div>
        )}
        {renderWatchList()}
      </div>
    </>
  );
};

export default WatchListComponent;

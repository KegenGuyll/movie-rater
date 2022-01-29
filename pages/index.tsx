import clsx from 'clsx';
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import Poster from '../components/movies/poster';
import Navigation from '../components/navigation';
import getTrendingMovies from '../endpoints/TMDB/getTrending';
import { Trending } from '../models/TMDB';
import Logger from '../utils/logger';

const Home: NextPage = () => {
  const [trendingMovies, setTrendingMovies] = useState<Trending>({
    page: 1,
    results: [],
  });

  const fetchTrending = async () => {
    try {
      const { res } = await getTrendingMovies('movie', 'week');

      if (res) {
        setTrendingMovies(res.data);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const fetchNewPage = async () => {
    try {
      const { res } = await getTrendingMovies(
        'movie',
        'week',
        trendingMovies.page + 1
      );

      if (res) {
        setTrendingMovies((prevState) => ({
          page: res.data.page,
          results: [...prevState.results, ...res.data.results],
        }));
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleWindow = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      fetchNewPage();
    }
  };

  useEffect(() => {
    if (trendingMovies.page === 1) {
      fetchNewPage();
    }

    window.addEventListener('scroll', handleWindow);

    return () => window.removeEventListener('scroll', handleWindow);
  }, [trendingMovies]);

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <>
      <Head>
        <title>MovieLot | Trending</title>
        <meta content="View the new trending movies" name="description" />
      </Head>
      <Navigation />
      <section className="flex flex-col items-center">
        <div
          className={clsx(
            'm-8 p-8 auto-cols-min w-max gap-2 md:gap-4',
            'grid grid-cols-2 xs:grid-cols-3 md:grid-cols-3 2xl:grid-cols-7'
          )}
        >
          {trendingMovies?.results?.map((value) => (
            <Poster key={value.id} movie={value} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;

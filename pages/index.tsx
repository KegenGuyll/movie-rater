import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import TrailerCarousel from '../components/movies/trailerCarousel';
import TrailerPlayer from '../components/movies/trailerPlayer';
import Navigation from '../components/navigation';
import TrendingMedia from '../components/sections/trendingMedia';
import getDiscoverMovie from '../endpoints/TMDB/getDiscoverMovie';
import { Movie } from '../models/TMDB';
import Logger from '../utils/logger';

const Home: NextPage = () => {
  const [discoverMovies, setDiscoverMovies] = useState<Movie[]>([]);

  const fetchDiscover = async () => {
    const { res, err } = await getDiscoverMovie();

    if (res) {
      setDiscoverMovies(res.data.results);
    }

    if (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchDiscover();
  }, []);

  return (
    <>
      <Head>
        <title>MovieLot | Trending</title>
        <meta content="View the new trending movies" name="description" />
      </Head>
      <Navigation />
      <TrailerCarousel movies={discoverMovies} />
      <TrailerPlayer />
      <TrendingMedia mediaType="movie" timeWindow="day" />
      <TrendingMedia mediaType="tv" timeWindow="week" />
    </>
  );
};

export default Home;

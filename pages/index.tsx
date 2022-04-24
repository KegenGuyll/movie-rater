import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import UserLeaderboard from '../components/leaderboard/userLeaderboardGrid';
import TrailerCarousel from '../components/movies/trailerCarousel';
import TrailerPlayer from '../components/movies/trailerPlayer';
import Navigation from '../components/navigation';
import FollowerFeedComponent from '../components/sections/followerFeedComponent';
import TrendingMedia from '../components/sections/trendingMedia';
import { useAuth } from '../context/AuthUserContext';
import getDiscoverMovie from '../endpoints/TMDB/getDiscoverMovie';
import followerFeed from '../endpoints/user/followerFeed';
import { MovieDocument } from '../models/firestore';
import { Movie } from '../models/TMDB';
import Logger from '../utils/logger';

const Home: NextPage = () => {
  const [discoverMovies, setDiscoverMovies] = useState<Movie[]>([]);
  const [followerFeedData, setFollowerFeedData] = useState<MovieDocument[]>([]);
  const { authUser } = useAuth();

  const fetchDiscover = async () => {
    const { res, err } = await getDiscoverMovie();

    if (res) {
      setDiscoverMovies(res.data.results);
    }

    if (err) {
      Logger.error(err);
    }
  };

  const fetchFollowFeed = async () => {
    if (!authUser) return;

    const token = await authUser.getIdToken();

    const { res, err } = await followerFeed(token, 30);

    if (res) {
      setFollowerFeedData(res.data.followingReviews);
    }

    if (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchFollowFeed();
  }, [authUser]);

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
      <FollowerFeedComponent films={followerFeedData} />
      <TrendingMedia mediaType="movie" timeWindow="day" />
      <TrendingMedia mediaType="tv" timeWindow="week" />
      <UserLeaderboard />
    </>
  );
};

export default Home;

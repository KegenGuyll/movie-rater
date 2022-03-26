import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

import ReviewedMoviesTable from '../components/my-movies/ReviewedMoviesTable';
import Navigation from '../components/navigation';
import { useAuth } from '../context/AuthUserContext';
import getAllUserReviews from '../endpoints/review/getAllUserReviews';
import { MovieDocument } from '../models/firestore';

const MyMovie: NextPage = () => {
  const { authUser } = useAuth();
  const [movies, setMovies] = useState<MovieDocument[] | null>(null);

  const fetchMovies = async () => {
    if (!authUser) return;

    const token = await authUser.getIdToken();

    const { res } = await getAllUserReviews(token);

    if (res) {
      setMovies(res.data);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [authUser]);

  return (
    <div>
      <Navigation />
      <div className="p-5">
        <ReviewedMoviesTable
          enableDelete
          fetchMovies={fetchMovies}
          movies={movies}
        />
      </div>
    </div>
  );
};

export default MyMovie;

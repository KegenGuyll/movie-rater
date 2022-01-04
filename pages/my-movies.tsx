import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import getAllReviewedMovies from '../endpoints/getAllReviewsMovie';
import { useAuth } from '../context/AuthUserContext';
import { MovieDocument } from '../models/firestore';
import ReviewedMoviesTable from '../components/my-movies/ReviewedMoviesTable';
import Navigation from '../components/navigation';

const MyMovie: NextPage = () => {
  const { authUser } = useAuth();
  const [movies, setMovies] = useState<MovieDocument[] | null>(null);

  const fetchMovies = async () => {
    if (!authUser) return;

    const token = await authUser.getIdToken();

    const { res } = await getAllReviewedMovies(token);

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
      <div className='p-5'>
        <ReviewedMoviesTable movies={movies} fetchMovies={fetchMovies} />
      </div>
    </div>
  );
};

export default MyMovie;

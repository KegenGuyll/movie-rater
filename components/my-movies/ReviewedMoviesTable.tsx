/* eslint-disable no-underscore-dangle */
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { useAuth } from '../../context/AuthUserContext';
import deleteReviewedMovie from '../../endpoints/review/deleteReviewedMovie';
import { MovieDocument } from '../../models/firestore';
import formatTitleUrl from '../../utils/formatTitleUrl';
import Table, { Columns } from '../table';

interface Props {
  movies: MovieDocument[] | null;
  fetchMovies: () => Promise<void>;
}

const ReviewedMoviesTable: React.FunctionComponent<Props> = ({
  movies,
  fetchMovies,
}) => {
  const router = useRouter();
  const { authUser } = useAuth();

  const handleMovieRoute = (id: number) => {
    if (!movies) return;

    const selectedMovie = movies[id];

    router.push(
      `/movie/${formatTitleUrl(selectedMovie.title, selectedMovie.tmdbID)}`
    );
  };

  const columns: Columns[] = [
    {
      clickEvent: (id: number) => handleMovieRoute(id),
      clickable: true,
      id: 1,
      name: 'Title',
      type: 'string',
    },
    {
      id: 2,
      name: 'Personal Score',
      type: 'number',
    },
    {
      id: 3,
      name: 'Reviewed Date',
      type: 'date',
    },
    {
      id: 6,
      name: 'Release Date',
      type: 'date',
    },
  ];
  const rows = useMemo(() => {
    if (!movies) return [];

    return movies.map((value, index) => ({
      'Personal Score': value.averagedAdvancedScore || value.simpleScore,
      'Release Date': value.release_date,
      'Reviewed Date': value.createdAt.seconds * 1000,
      Title: value.title,
      id: index,
    }));
  }, [movies]);

  const deleteMovie = async (ids: (string | number)[]) => {
    if (!authUser || !movies) return;

    const token = await authUser.getIdToken();

    await Promise.all(
      ids.map(async (id) => {
        await deleteReviewedMovie(movies[Number(id)]._id, token);
      })
    );

    await fetchMovies();
  };

  const options = {
    delete: deleteMovie,
    rowsSelectable: true,
    search: {
      enabled: true,
      sortKey: 'Title',
    },
    title: 'Reviewed Movies',
  };

  return (
    <div className="p-5">
      <Table columns={columns} options={options} rows={rows} />
    </div>
  );
};

export default ReviewedMoviesTable;

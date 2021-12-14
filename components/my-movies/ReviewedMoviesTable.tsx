import { useMemo } from 'react';
import { useAuth } from '../../context/AuthUserContext';
import { useRouter } from 'next/router';
import deleteReviewedMovie from '../../endpoints/deleteReviewedMovie';
import { MovieDocument } from '../../models/firestore';
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
  const columns: Columns[] = [
    {
      id: 1,
      name: 'Title',
      type: 'string',
      clickable: true,
      clickEvent: (id: number) => handleMovieRoute(id),
    },
    {
      id: 2,
      name: 'Personal Score',
      type: 'number',
    },
    {
      id: 4,
      name: 'Tomato Score',
      type: 'number',
    },
    {
      id: 5,
      name: 'Audience Score',
      type: 'number',
    },
    {
      id: 3,
      name: 'Reviewed Date',
      type: 'date',
    },
    {
      id: 6,
      name: 'Year',
      type: 'number',
    },
  ];
  const rows = useMemo(() => {
    if (!movies) return [];

    return movies.map((value, index) => {
      return {
        id: index,
        Title: value.title,
        'Personal Score': value.averagedAdvancedScore || value.simpleScore,
        'Tomato Score': value.rotten?.tomatometerscore,
        'Audience Score': value.rotten?.audiencescore,
        'Reviewed Date': value.createdAt.seconds * 1000,
        Year: value.rotten?.info.year,
      };
    });
  }, [movies]);

  const handleMovieRoute = (id: number) => {
    if (!movies) return;

    const selectedMovie = movies[id];

    router.push(
      `/movies/${selectedMovie.title}?year=${selectedMovie.rotten?.info.year}&imdbuuid=${selectedMovie.imdb?.uuid}`
    );
  };

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
    rowsSelectable: true,
    search: {
      enabled: true,
      sortKey: 'Title',
    },
    title: 'Reviewed Movies',
    delete: deleteMovie,
  };

  return (
    <div className='p-5'>
      <Table rows={rows} columns={columns} options={options} />
    </div>
  );
};

export default ReviewedMoviesTable;

import { FunctionComponent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/dist/client/router';
import { Movie } from '../../models/TMDB';

interface Props {
  movie: Movie;
  clickable?: boolean;
}

const Poster: FunctionComponent<Props> = ({ movie, clickable }) => {
  const [display, setDisplay] = useState<boolean>(true);
  const router = useRouter();
  const { title, poster_path, release_date, id } = movie;

  const imgNotFound = () => {
    setDisplay(false);
  };

  if (!display) return null;

  const onClick = (title: string, year: string) => {
    router.push(`/movies/${title}?year=${year}&id=${id}`);
  };

  return (
    <button
      disabled={!clickable}
      type='button'
      onClick={() => onClick(title, release_date.split('-')[0])}
      className='bg-black cursor-pointer w-32 h-52 md:w-48 md:h-80 rounded relative'>
      <Image
        className='rounded object-fill select-none'
        layout='fill'
        objectFit='fill'
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        alt={title}
        blurDataURL={`https://image.tmdb.org/t/p/w100${poster_path}`}
        onError={imgNotFound}
      />
    </button>
  );
};

Poster.defaultProps = {
  clickable: true,
};

export default Poster;

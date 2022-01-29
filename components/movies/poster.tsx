import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useState } from 'react';

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

  const onClick = (onClickTitle: string, year: string) => {
    router.push(`/movies/${onClickTitle}?year=${year}&id=${id}`);
  };

  return (
    <button
      className="bg-black cursor-pointer w-32 h-52 md:w-48 md:h-80 rounded relative"
      disabled={!clickable}
      type="button"
      onClick={() => onClick(title, release_date.split('-')[0])}
    >
      <Image
        alt={title}
        blurDataURL={`https://image.tmdb.org/t/p/w100${poster_path}`}
        className="rounded object-fill select-none"
        layout="fill"
        objectFit="fill"
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        onError={imgNotFound}
      />
    </button>
  );
};

Poster.defaultProps = {
  clickable: true,
};

export default Poster;

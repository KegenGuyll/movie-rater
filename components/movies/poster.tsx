import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useState } from 'react';

import { Movie, Person, TV } from '../../models/TMDB';

interface Props {
  media: Movie | TV | Person;
  clickable?: boolean;
}

const Poster: FunctionComponent<Props> = ({ media, clickable }) => {
  const [display, setDisplay] = useState<boolean>(true);
  const router = useRouter();

  const imgNotFound = () => {
    setDisplay(false);
  };

  if (!display) return null;

  const onClick = (onClickTitle: string, year: string) => {
    router.push(
      `/${media.media_type}/${onClickTitle}?year=${year}&id=${media.id}`
    );
  };

  const renderMovie = ({ title, release_date, poster_path }: Movie) => (
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

  const renderTV = ({ name, poster_path, first_air_date }: TV) => (
    <button
      className="bg-black cursor-pointer w-32 h-52 md:w-48 md:h-80 rounded relative"
      disabled={!clickable}
      type="button"
      onClick={() => onClick(name, first_air_date.split('-')[0])}
    >
      <Image
        alt={name}
        blurDataURL={`https://image.tmdb.org/t/p/w100${poster_path}`}
        className="rounded object-fill select-none"
        layout="fill"
        objectFit="fill"
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        onError={imgNotFound}
      />
    </button>
  );

  if (!media) return null;

  return (
    <>
      {media.media_type === 'movie' && renderMovie(media)}
      {media.media_type === 'tv' && renderTV(media)}
    </>
  );
};

Poster.defaultProps = {
  clickable: true,
};

export default Poster;

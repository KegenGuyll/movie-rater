import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useState } from 'react';

import { MovieDetails, Person } from '../../models/TMDB';
import { TVDetails } from '../../models/TMDB/tv';
import formatTitleUrl from '../../utils/formatTitleUrl';

interface Props {
  media: MovieDetails | TVDetails | Person;
  clickable?: boolean;
}

const Poster: FunctionComponent<Props> = ({ media, clickable }) => {
  const [display, setDisplay] = useState<boolean>(true);
  const router = useRouter();

  const imgNotFound = () => {
    setDisplay(false);
  };

  if (!display) return null;

  const onClick = (onClickTitle: string, id: string | number) => {
    router.push(`/${media.media_type}/${formatTitleUrl(onClickTitle, id)}`);
  };

  const renderMovie = ({ title, poster_path, id }: MovieDetails) => (
    <Link href={`/movie/${formatTitleUrl(title, id)}?videos=true`}>
      <a>
        <div className="bg-black cursor-pointer w-32 h-52 md:w-48 md:h-80 rounded relative">
          <Image
            alt={title}
            blurDataURL={`https://image.tmdb.org/t/p/w100${poster_path}`}
            className="rounded object-fill select-none"
            layout="fill"
            objectFit="fill"
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            onError={imgNotFound}
          />
        </div>
      </a>
    </Link>
  );

  const renderTV = ({ name, poster_path, id }: TVDetails) => (
    <button
      className="bg-black cursor-pointer w-32 h-52 md:w-48 md:h-80 rounded relative"
      disabled={!clickable}
      type="button"
      onClick={() => onClick(name, id)}
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
      {media.media_type === undefined && renderMovie(media)}
    </>
  );
};

Poster.defaultProps = {
  clickable: true,
};

export default Poster;

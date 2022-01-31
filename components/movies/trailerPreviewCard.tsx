import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useEffect, useState } from 'react';

import getMovieVideos from '../../endpoints/TMDB/getMovieVideos';
import { Movie, Video } from '../../models/TMDB';
import imageUrl from '../../utils/imageUrl';
import Logger from '../../utils/logger';
import Typography from '../typography';

interface Props {
  movie: Movie;
}

const TrailerPreviewCard: FunctionComponent<Props> = ({ movie }: Props) => {
  const [data, setData] = useState<Video[]>([]);

  const router = useRouter();

  const handleFetch = async (id: number) => {
    const { res, err } = await getMovieVideos(id);

    if (res) {
      const trailers = res.data.results.filter(
        (value) =>
          value.type === 'Trailer' && value.official && value.site === 'YouTube'
      );

      setData(trailers);
    }

    if (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    if (!movie) return;
    handleFetch(movie.id);
  }, [movie]);

  return (
    <button
      className="flex justify-center items-center text-left w-full"
      type="button"
      onClick={() =>
        router.push(`?key=${data[0].key}`, undefined, { shallow: true })
      }
    >
      <div className="flex justify-center items-center relative">
        <Image
          priority
          alt={movie.title}
          className="rounded"
          height={545}
          src={`${imageUrl(500, false)}/${movie.backdrop_path}`}
          width={900}
        />
        <div className="rounded absolute bg-gradient-to-t h-[545px] w-[900px] from-dark-background " />
        <div className="absolute z-40 bottom-2 left-2 flex items-center">
          <div className="flex-grow">
            <Image
              alt={movie.title}
              className="rounded shadow"
              height={283}
              src={`${imageUrl(300)}/${movie.poster_path}`}
              width={173}
            />
          </div>
          <div className="flex items-center flex-grow ml-4 text-dark-text">
            <span className="material-icons-outlined mr-4 text-5xl">
              play_circle_filled
            </span>
            <div>
              <Typography variant="h1">{movie.title}</Typography>
              <Typography variant="subtitle">
                Click to Watch the Trailer
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default TrailerPreviewCard;

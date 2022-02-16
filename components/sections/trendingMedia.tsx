import clsx from 'clsx';
import React, { FunctionComponent, useEffect, useState } from 'react';

import getTrendingMovies from '../../endpoints/TMDB/getTrending';
import { MediaType, TimeWindow, Trending } from '../../models/TMDB';
import Logger from '../../utils/logger';
import Poster from '../movies/poster';
import Typography from '../typography';

interface Props {
  timeWindow: TimeWindow;
  mediaType: MediaType;
}

const TrendingMedia: FunctionComponent<Props> = ({
  timeWindow,
  mediaType,
}: Props) => {
  const [trendingMovies, setTrendingMovies] = useState<Trending>({
    page: 1,
    results: [],
  });
  const [open, setOpen] = useState<boolean>(true);

  const fetchTrending = async () => {
    const { res, err } = await getTrendingMovies(mediaType, timeWindow);

    if (res) {
      setTrendingMovies(res.data);
    }

    if (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, [timeWindow, mediaType]);

  const createMediaCopy = (type: MediaType) => {
    let copy = '';
    switch (type) {
      case 'all':
        copy = 'Media';
        break;
      case 'movie':
        copy = 'Movies';
        break;
      case 'person':
        copy = 'People';
        break;
      case 'tv':
        copy = 'Shows';
        break;
      default:
        copy = 'Media';
        break;
    }

    return copy;
  };

  const createTimeFrameCopy = (type: TimeWindow) => {
    let copy = '';
    switch (type) {
      case 'day':
        copy = 'Today';
        break;
      case 'week':
        copy = 'This Week';
        break;
      default:
        copy = 'Today';
        break;
    }

    return copy;
  };

  if (!trendingMovies.results.length) return null;

  return (
    <section className="flex flex-col p-8 space-y-8 mt-20">
      <button
        className="flex items-center text-left w-full p-2 rounded hover:bg-dark-components"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <Typography className=" text-cta flex-grow" variant="h2">
          {`Trending ${createMediaCopy(mediaType)} ${createTimeFrameCopy(
            timeWindow
          )}`}
        </Typography>
        <span className="material-icons-outlined text-dark-text">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {open && (
        <div className="flex items-center">
          <div
            className={clsx(
              ' py-2 w-max gap-2 md:gap-4',
              'grid grid-flow-col overflow-auto'
            )}
          >
            {trendingMovies.results.map((value) => (
              <Poster key={value.id} media={value} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TrendingMedia;

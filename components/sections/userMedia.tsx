import clsx from 'clsx';
import React, { FunctionComponent, useEffect, useState } from 'react';

import getMovieDetails from '../../endpoints/TMDB/getMovie';
import getTVDetails from '../../endpoints/TMDB/tv/getTvDetails';
import { GetUserTopMovies } from '../../endpoints/user/getUserTopMovies';
import { MovieDetails } from '../../models/TMDB';
import { TVDetails } from '../../models/TMDB/tv';
import { WatchList } from '../../models/watchlist';
import RadialBarChart from '../charts/radialbarChart';
import Poster from '../movies/poster';
import Typography from '../typography';
import PreviewPoster from '../watch-lists/previewPoster';

interface Props {
  title: string;
  media: GetUserTopMovies[] | null;
  watchLists: WatchList[] | null;
  auth: boolean;
}

const UserMedia: FunctionComponent<Props> = ({
  title,
  media,
  watchLists,
  auth,
}: Props) => {
  const [lists, setLists] = useState<(MovieDetails | TVDetails)[]>([]);
  const [open, setOpen] = useState<boolean>(true);

  const handleFetchMovies = async () => {
    if (!media) return;

    if (media.length) {
      media.forEach(async (review) => {
        if (review.tmdbID) {
          const { res, err } = await getMovieDetails(review.tmdbID.toString());
          if (res) {
            res.data.media_type = 'movie';
            setLists((prevState) => [...prevState, res.data]);
          }
          if (err) {
            const { res: tvDetails } = await getTVDetails(review.tmdbID);
            if (tvDetails) {
              tvDetails.data.media_type = 'tv';
              setLists((prevState) => [...prevState, tvDetails.data]);
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    if (!media) return;

    if (media.length <= lists.length) return;

    handleFetchMovies();
  }, [media]);

  return (
    <div className="flex flex-col p-8 space-y-8 mt-20">
      <button
        className="flex items-center text-left w-full p-2 rounded hover:bg-dark-components"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <Typography className=" text-cta flex-grow" variant="h2">
          {title}
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
            {media &&
              lists.length &&
              lists.map((list, index) => (
                <div key={list.id} className="relative">
                  <Poster media={list} />
                  {media && media[index] && (
                    <div className=" h-16 w-16 bg-dark-components rounded-full p-1 text-dark-text absolute top-1 right-1">
                      <RadialBarChart score={media[index].score * 10} />
                    </div>
                  )}
                </div>
              ))}
            {watchLists &&
              watchLists.map((watchlist) => {
                if (!watchlist.public) {
                  if (auth) {
                    return (
                      <PreviewPoster
                        key={watchlist._id}
                        watchList={watchlist}
                      />
                    );
                  }

                  return null;
                }

                return (
                  <PreviewPoster key={watchlist._id} watchList={watchlist} />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMedia;

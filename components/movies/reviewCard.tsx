import clsx from 'clsx';
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react';

import { useAuth } from '../../context/AuthUserContext';
import { MovieDocument } from '../../models/firestore';
import { RottenMovie } from '../../models/rottenTomatoes';
import { MovieDetails } from '../../models/TMDB';
import ImdbMeter from '../imdbMeter';
import MediaCard from '../mediaCard';
import AudienceMeter from '../rottenTomatoes/audience_meter';
import TomatoMeter from '../rottenTomatoes/tomato_meter';
import Typography from '../typography';
import UserMeter from '../userMeter';

interface Props {
  details: MovieDetails;
  movie: RottenMovie | undefined | null;
  documentMovie: MovieDocument | null;
  setMovieReview: Dispatch<SetStateAction<boolean>>;
}

const ReviewCard: FunctionComponent<Props> = ({
  details,
  movie,
  documentMovie,
  setMovieReview,
}) => {
  const { authUser } = useAuth();

  return (
    <MediaCard
      className={clsx(
        'col-span-1 gap-1',
        'lg:col-span-2 lg:gap-2  2xl:gap-4 2xl:col-span-1',
      )}
      title="Reviews"
    >
      <div
        className={clsx(
          'flex flex-col items-stretch',
          'lg:grid lg:grid-rows-1 lg:grid-flow-col-dense',
        )}
      >
        {movie && (
          <div>
            <Typography
              className={clsx('hidden', 'lg:block mb-3')}
              variant="h4"
            >
              Rotten Tomatoes
            </Typography>
            <TomatoMeter
              rottenTomatoesScore={movie?.tomatometerscore}
              rottenTomatoesStatus={movie?.tomatometerstate}
            />
            <AudienceMeter
              rottenTomatoesScore={movie?.audiencescore}
              rottenTomatoesStatus={movie?.audiencestate}
            />
          </div>
        )}
        {movie && (
          <div className="h-full w-full flex  items-center">
            <div className="hidden lg:block 2xl:mx-4 lg:mx-2 border border-r border-dark-text h-24 w-0" />
          </div>
        )}
        {details && (
          <div>
            <Typography
              className={clsx('hidden', 'lg:block mb-3')}
              variant="h4"
            >
              IMDb
            </Typography>
            <ImdbMeter rating={String(details.vote_average)} />
          </div>
        )}
        {documentMovie && authUser && (
          <div className="h-full w-full flex  items-center">
            <div className="hidden lg:block 2xl:mx-4 lg:mx-2 border border-r border-dark-text h-24 w-0" />
          </div>
        )}
        {documentMovie && authUser && (
          <div className="flex flex-col lg:items-center">
            <Typography
              className={clsx('hidden', 'lg:block mb-3')}
              variant="h4"
            >
              Personal Score
            </Typography>
            <UserMeter
              authUser={authUser}
              documentMovie={documentMovie}
              setMovieReview={setMovieReview}
            />
          </div>
        )}
      </div>
    </MediaCard>
  );
};

export default ReviewCard;

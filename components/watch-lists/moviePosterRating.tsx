import Image from 'next/image';
import React, { FunctionComponent } from 'react';

import { User } from '../../models/user';
import { Rating } from '../../models/watchlist';
import Typography from '../typography';

interface Props {
  ratings: Rating | undefined;
  user: User | null;
}

const MoviePosterRating: FunctionComponent<Props> = ({ ratings, user }) => (
  <div className="flex flex-wrap my-2  justify-evenly items-center">
    {ratings && (
      <>
        {ratings.rotten.tomatometerscore && (
          <div className="flex items-center">
            <Image
              priority
              alt={ratings.rotten.tomatometerstate}
              height={24}
              objectFit="cover"
              src={`/img/rottenTomatoes/${ratings.rotten.tomatometerstate}.svg`}
              width={24}
            />

            <Typography className="ml-2" variant="light">
              {ratings.rotten.tomatometerscore}%
            </Typography>
          </div>
        )}
        {ratings.rotten.audiencescore && (
          <div className="flex items-center">
            <Image
              priority
              alt={ratings.rotten.audiencestate}
              height={32}
              objectFit="cover"
              src={`/img/rottenTomatoes/${ratings.rotten.audiencestate}.svg`}
              width={24}
            />

            <Typography className="ml-2" variant="light">
              {ratings.rotten.audiencescore}%
            </Typography>
          </div>
        )}
        {ratings.imdb.score && (
          <div className="flex items-center">
            <Image
              priority
              alt={ratings.imdb.score || 'Imdb'}
              className="rounded"
              height={24}
              objectFit="cover"
              src="/img/IMDb_Logo_square.svg"
              width={24}
            />

            <Typography className="ml-2" variant="light">
              {ratings.imdb.score}
            </Typography>
          </div>
        )}
        {user &&
          user.displayName &&
          (ratings.personal.advancedScore || ratings.personal.simpleScore) && (
            <div className="flex items-center">
              {user.photoUrl && (
                <Image
                  priority
                  alt={user.displayName}
                  className="rounded-full"
                  height={24}
                  objectFit="cover"
                  src={user.photoUrl}
                  width={24}
                />
              )}
              <Typography className="ml-2" variant="light">
                {ratings.personal.advancedScore || ratings.personal.simpleScore}
              </Typography>
            </div>
          )}
      </>
    )}
  </div>
);

export default MoviePosterRating;

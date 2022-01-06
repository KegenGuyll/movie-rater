import { FunctionComponent } from 'react';
import { Rating } from '../../models/watchlist';
import Image from 'next/image';
import Typography from '../typography';
import { User } from '../../models/user';

interface Props {
  ratings: Rating | undefined;
  user: User | null;
}

const MoviePosterRating: FunctionComponent<Props> = ({ ratings, user }) => {
  return (
    <div className='flex flex-wrap my-2  justify-evenly items-center'>
      {ratings && (
        <>
          {ratings.rotten.tomatometerscore && (
            <div className='flex items-center'>
              <Image
                width={24}
                height={24}
                objectFit='cover'
                priority
                src={`/img/rottenTomatoes/${ratings.rotten.tomatometerstate}.svg`}
                alt={ratings.rotten.tomatometerstate}
              />

              <Typography className='ml-2' variant='light'>
                {ratings.rotten.tomatometerscore}%
              </Typography>
            </div>
          )}
          {ratings.rotten.audiencescore && (
            <div className='flex items-center'>
              <Image
                width={24}
                height={32}
                objectFit='cover'
                priority
                src={`/img/rottenTomatoes/${ratings.rotten.audiencestate}.svg`}
                alt={ratings.rotten.audiencestate}
              />

              <Typography className='ml-2' variant='light'>
                {ratings.rotten.audiencescore}%
              </Typography>
            </div>
          )}
          {ratings.imdb.score && (
            <div className='flex items-center'>
              <Image
                className='rounded'
                width={24}
                height={24}
                objectFit='cover'
                priority
                src={`/img/IMDb_Logo_square.svg`}
                alt={ratings.imdb.score || 'Imdb'}
              />

              <Typography className='ml-2' variant='light'>
                {ratings.imdb.score}
              </Typography>
            </div>
          )}
          {user &&
            user.displayName &&
            (ratings.personal.advancedScore ||
              ratings.personal.simpleScore) && (
              <div className='flex items-center'>
                {user.photoUrl && (
                  <Image
                    className='rounded-full'
                    width={24}
                    height={24}
                    objectFit='cover'
                    priority
                    src={user.photoUrl}
                    alt={user.displayName}
                  />
                )}
                <Typography className='ml-2' variant='light'>
                  {ratings.personal.advancedScore ||
                    ratings.personal.simpleScore}
                </Typography>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default MoviePosterRating;

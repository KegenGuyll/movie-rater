import { User } from 'firebase/auth';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { MovieDocument } from '../models/firestore';
import Typography from './typography';
import Image from 'next/image';

interface Props {
  documentMovie: MovieDocument;
  authUser: User;
  setMovieReview: Dispatch<SetStateAction<boolean>>;
}

const UserMeter: FunctionComponent<Props> = ({
  documentMovie,
  authUser,
  setMovieReview,
}) => {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className='flex flex-row items-center'>
      {authUser.photoURL ? (
        <Image
          alt={authUser.displayName || authUser.email || 'user'}
          className='rounded-full'
          src={authUser.photoURL}
          width={48}
          height={48}
        />
      ) : (
        <span className='material-icons text-6xl '>person</span>
      )}
      {documentMovie.averagedAdvancedScore && (
        <div className='flex flex-col mr-5'>
          {documentMovie.simpleScore && <Typography>Advanced Score</Typography>}

          <Typography className='ml-5' variant='h4'>
            <span className='text-3xl'>
              {documentMovie.averagedAdvancedScore}
            </span>{' '}
            / 10
          </Typography>
        </div>
      )}
      {documentMovie.simpleScore && (
        <div className='flex flex-col'>
          {documentMovie.averagedAdvancedScore && (
            <Typography>Simple Score</Typography>
          )}
          <Typography className='ml-5' variant='h4'>
            <span className='text-3xl'>{documentMovie.simpleScore}</span> / 10
          </Typography>
        </div>
      )}
      {hover && (
        <button
          onClick={() => setMovieReview(true)}
          className='flex items-center justify-center ml-8'>
          <span className='material-icons'>edit</span>
        </button>
      )}
    </div>
  );
};

export default UserMeter;

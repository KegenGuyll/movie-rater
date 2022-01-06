import { FunctionComponent, HTMLAttributes } from 'react';
import { WatchList } from '../../models/watchlist';
import Typography from '../typography';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthUserContext';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  watchList: WatchList;
}

const PreviewPoster: FunctionComponent<Props> = ({
  children,
  watchList,
  ...props
}) => {
  const router = useRouter();
  const { authUser } = useAuth();

  if (authUser) {
    return (
      <button
        onClick={() => router.push(`/user/${authUser.uid}/${watchList._id}`)}
        {...props}>
        <div className='flex flex-col items-center justify-center text-left hover:bg-dark-light bg-dark-components w-64 overflow-hidden p-4 rounded text-dark-text'>
          <div className='my-4 shadow'>
            <Image
              className='rounded shadow'
              alt={watchList.title}
              objectFit='cover'
              src={`https://avatars.dicebear.com/api/identicon/${watchList._id}.svg`}
              width={126}
              height={126}
            />
          </div>
          <div className=' text-center w-full'>
            <Typography
              title={watchList.title}
              className='truncate'
              variant='h3'>
              {watchList.title}
            </Typography>
            <Typography
              title={watchList.description}
              className='truncate'
              variant='subtitle'>
              {watchList.description}
            </Typography>
          </div>
        </div>
      </button>
    );
  }

  return null;
};

export default PreviewPoster;

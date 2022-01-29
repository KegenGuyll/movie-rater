import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FunctionComponent, HTMLAttributes } from 'react';

import { useAuth } from '../../context/AuthUserContext';
import { WatchList } from '../../models/watchlist';
import Typography from '../typography';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  watchList: WatchList;
}

const PreviewPoster: FunctionComponent<Props> = ({ watchList, ...props }) => {
  const router = useRouter();
  const { authUser } = useAuth();

  if (authUser) {
    return (
      <button
        type="button"
        onClick={() => router.push(`/user/${authUser.uid}/${watchList._id}`)}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        <div className="flex flex-col items-center justify-center text-left hover:bg-dark-light bg-dark-components w-64 overflow-hidden p-4 rounded text-dark-text">
          <div className="my-4 shadow">
            <Image
              alt={watchList.title}
              className="rounded shadow"
              height={126}
              objectFit="cover"
              src={`https://avatars.dicebear.com/api/identicon/${watchList._id}.svg`}
              width={126}
            />
          </div>
          <div className=" text-center w-full">
            <Typography
              className="truncate"
              title={watchList.title}
              variant="h3"
            >
              {watchList.title}
            </Typography>
            <Typography
              className="truncate"
              title={watchList.description}
              variant="subtitle"
            >
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

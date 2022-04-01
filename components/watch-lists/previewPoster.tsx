/* eslint-disable react/jsx-props-no-spreading */
import Image from 'next/image';
import Link from 'next/link';
import React, { FunctionComponent, HTMLAttributes } from 'react';

import Typography from '../typography';

interface Props extends HTMLAttributes<HTMLAnchorElement> {
  watchList: any;
}

const PreviewPoster: FunctionComponent<Props> = ({ watchList, ...props }) => (
  <Link passHref href={`/watch-list/${watchList._id}`}>
    <a {...props}>
      <div>
        <div className="flex flex-col items-center justify-center text-left hover:bg-dark-light bg-dark-components w-64 overflow-hidden p-4 rounded text-dark-text">
          <div className="my-4 shadow flex-grow">
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
      </div>
    </a>
  </Link>
);

export default PreviewPoster;

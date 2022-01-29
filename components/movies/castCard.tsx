import Image from 'next/image';
import React, { FunctionComponent } from 'react';

import { MovieCast } from '../../models/TMDB';
import MediaCard from '../mediaCard';
import Typography from '../typography';

interface Props {
  cast: MovieCast | null;
}

const CastCard: FunctionComponent<Props> = ({ cast }: Props) => {
  if (!cast) return null;

  return (
    <MediaCard title="Cast">
      {cast.cast.map((value) => (
        <div key={value.id} className="flex flex-wrap items-center my-5">
          {value.profile_path && (
            <div className="mr-5">
              <Image
                alt={value.name}
                className="rounded-full"
                height={64}
                src={`https://image.tmdb.org/t/p/original${value.profile_path}`}
                width={64}
              />
            </div>
          )}
          <div className="flex flex-col">
            <Typography>{value.name}</Typography>
            {value.character.split('/').map((name, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Typography key={index}>{name}</Typography>
            ))}
          </div>
        </div>
      ))}
    </MediaCard>
  );
};

export default CastCard;

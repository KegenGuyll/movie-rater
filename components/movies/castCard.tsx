import { FunctionComponent } from 'react';
import Image from 'next/image';
import { MovieCast } from '../../models/TMDB';
import MediaCard from '../mediaCard';
import Typography from '../typography';

interface Props {
  cast: MovieCast | null;
}

const CastCard: FunctionComponent<Props> = ({ cast }: Props) => {
  if (!cast) return null;

  return (
    <MediaCard title='Cast'>
      {cast.cast.map((value) => (
        <div className='flex flex-wrap items-center my-5' key={value.id}>
          {value.profile_path && (
            <div className='mr-5'>
              <Image
                className='rounded-full'
                width={64}
                height={64}
                src={`https://image.tmdb.org/t/p/original${value.profile_path}`}
                alt={value.name}
              />
            </div>
          )}
          <div className='flex flex-col'>
            <Typography>{value.name}</Typography>
            {value.character.split('/').map((name, index) => (
              <Typography key={index}>{name}</Typography>
            ))}
          </div>
        </div>
      ))}
    </MediaCard>
  );
};

export default CastCard;

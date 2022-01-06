import { FunctionComponent } from 'react';
import Image from 'next/image';
import Typography from './typography';

interface Props {
  rating: string;
}

const ImdbMeter: FunctionComponent<Props> = ({ rating }: Props) => {
  return (
    <div className='flex flex-row items-center'>
      <div className='mr-2'>
        <Image
          width={48}
          height={48}
          alt='imdb'
          src={'/img/IMDb_Logo_Square.svg'}
        />
      </div>

      <span className='text-dark-text text-2xl lg:text-xl'>{`${rating} / 10`}</span>
    </div>
  );
};

export default ImdbMeter;

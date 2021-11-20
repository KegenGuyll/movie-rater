import { FunctionComponent } from 'react';
import Image from 'next/image';
import Typography from './typography';

interface Props {
  rating: string;
}

const ImdbMeter: FunctionComponent<Props> = ({ rating }: Props) => {
  return (
    <div className='flex flex-wrap items-center'>
      <div className='mr-5'>
        <Image width={75} height={35} alt='imdb' src={'/img/imdb-icon.svg'} />
      </div>

      <span className='text-dark-text text-2xl'>{`${rating} / 10`}</span>
    </div>
  );
};

export default ImdbMeter;

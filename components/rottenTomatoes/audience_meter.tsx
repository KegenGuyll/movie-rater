import { FunctionComponent } from 'react';
import Image from 'next/image';

interface Props {
  rottenTomatoesStatus: 'spilled' | 'upright' | '' | undefined;
  rottenTomatoesScore: string | undefined;
}

const AudienceMeter: FunctionComponent<Props> = ({
  rottenTomatoesScore,
  rottenTomatoesStatus,
}: Props) => {
  if (!rottenTomatoesStatus || !rottenTomatoesScore) return null;

  return (
    <div className='flex flex-wrap items-center'>
      <div className='mr-5'>
        <Image
          width={45}
          height={54}
          priority
          src={`/img/rottenTomatoes/${rottenTomatoesStatus}.svg`}
          alt={rottenTomatoesStatus}
        />
      </div>
      <span className='text-dark-text text-2xl'>{`${rottenTomatoesScore}%`}</span>
    </div>
  );
};

export default AudienceMeter;

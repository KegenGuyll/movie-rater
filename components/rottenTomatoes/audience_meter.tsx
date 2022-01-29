import Image from 'next/image';
import React, { FunctionComponent } from 'react';

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
    <div className="flex flex-wrap items-center">
      <div className="mr-5">
        <Image
          priority
          alt={rottenTomatoesStatus}
          height={54}
          src={`/img/rottenTomatoes/${rottenTomatoesStatus}.svg`}
          width={45}
        />
      </div>
      <span className="text-dark-text text-2xl">{`${rottenTomatoesScore}%`}</span>
    </div>
  );
};

export default AudienceMeter;

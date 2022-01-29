import clsx from 'clsx';
import Image from 'next/image';
import React, { FunctionComponent } from 'react';

interface Props {
  rottenTomatoesStatus: 'certified-fresh' | 'rotten' | 'fresh' | '' | undefined;
  rottenTomatoesScore: string | undefined;
}

const TomatoMeter: FunctionComponent<Props> = ({
  rottenTomatoesScore,
  rottenTomatoesStatus,
}: Props) => {
  if (!rottenTomatoesStatus || !rottenTomatoesScore) return null;

  return (
    <div className={clsx('flex flex-wrap items-center')}>
      <div className="mr-5">
        <Image
          priority
          alt={rottenTomatoesStatus}
          height={48}
          src={`/img/rottenTomatoes/${rottenTomatoesStatus}.svg`}
          width={48}
        />
      </div>
      <span className="text-dark-text text-2xl">{`${rottenTomatoesScore}%`}</span>
    </div>
  );
};

export default TomatoMeter;

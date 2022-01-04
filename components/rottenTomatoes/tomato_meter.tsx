import React, { FunctionComponent, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

interface Props {
  rottenTomatoesStatus: 'certified-fresh' | 'rotten' | 'fresh' | '';
  rottenTomatoesScore: string;
}

const TomatoMeter: FunctionComponent<Props> = ({
  rottenTomatoesScore,
  rottenTomatoesStatus,
}: Props) => {
  if (!rottenTomatoesStatus) return null;

  return (
    <div className={clsx('flex flex-wrap items-center')}>
      <div className='mr-5'>
        <Image
          width={48}
          height={48}
          priority
          src={`/img/rottenTomatoes/${rottenTomatoesStatus}.svg`}
          alt={rottenTomatoesStatus}
        />
      </div>
      <span className='text-dark-text text-2xl'>{`${rottenTomatoesScore}%`}</span>
    </div>
  );
};

export default TomatoMeter;

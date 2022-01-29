import Image from 'next/image';
import React, { FunctionComponent } from 'react';

interface Props {
  rating: string;
}

const ImdbMeter: FunctionComponent<Props> = ({ rating }: Props) => (
  <div className="flex flex-row items-center">
    <div className="mr-2">
      <Image
        alt="imdb"
        height={48}
        src="/img/IMDb_Logo_Square.svg"
        width={48}
      />
    </div>

    <span className="text-dark-text text-2xl lg:text-xl">{`${rating} / 10`}</span>
  </div>
);

export default ImdbMeter;

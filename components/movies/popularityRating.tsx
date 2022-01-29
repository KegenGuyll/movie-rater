import React, { FunctionComponent } from 'react';

import { IMDBPopular } from '../../models/imdb/popular';

interface Props {
  movie: IMDBPopular;
}

const PopularityRating: FunctionComponent<Props> = ({ movie }: Props) => {
  const { popularityChange, titleMeter } = movie;

  if (!popularityChange) {
    return null;
  }

  if (titleMeter === 'positive') {
    return (
      <div
        className="bg-dark-components rounded-full p-1 flex justify-center items-center"
        title={popularityChange}
      >
        <span className="material-icons-outlined text-green-500">
          arrow_upward
        </span>
      </div>
    );
  }

  return (
    <div
      className="bg-dark-components rounded-full p-1 flex justify-center items-center"
      title={popularityChange}
    >
      <span className="material-icons-outlined text-red-500">
        arrow_downward
      </span>
    </div>
  );
};

export default PopularityRating;

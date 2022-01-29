import React, { FunctionComponent } from 'react';

import Typography from '../typography';

interface Props {
  rating: string | null | undefined;
}

const MovieRating: FunctionComponent<Props> = ({ rating }: Props) => {
  if (!rating) return null;

  return (
    <div className="px-2 py-1 rounded border border-dark-text text-dark-text w-max">
      <Typography variant="light">{rating}</Typography>
    </div>
  );
};

export default MovieRating;

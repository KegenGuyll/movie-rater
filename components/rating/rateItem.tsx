import clsx from 'clsx';
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react';

import Typography from '../typography';

interface Props {
  value: number;
  selected: boolean;
  setClicked: Dispatch<SetStateAction<number | null>>;
}

const RateItem: FunctionComponent<Props> = ({
  value,
  selected,
  setClicked,
}: Props) => (
  <div>
    <button
      className={clsx(
        'rounded-full p-1 px-3',
        selected && 'border-2 border-dark-text',
      )}
      type="button"
      onClick={() => setClicked(value)}
    >
      <Typography>{value}</Typography>
    </button>
  </div>
);

export default RateItem;

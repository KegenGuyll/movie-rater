import clsx from 'clsx';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
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
}: Props) => {
  return (
    <div>
      <button
        className={clsx(
          'rounded-full p-1 px-3',
          selected && 'border-2 border-dark-text'
        )}
        onClick={(e) => setClicked(value)}>
        <Typography>{value}</Typography>
      </button>
    </div>
  );
};

export default RateItem;

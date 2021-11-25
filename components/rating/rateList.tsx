import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import Typography from '../typography';
import RateItem from './rateItem';

interface Props {
  label: string;
  setValue: (value: number | null) => void;
  scale: number;
}

const RateList: FunctionComponent<Props> = ({
  scale,
  setValue,
  label,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const array = useMemo(
    () => Array.from({ length: scale }, (v, k) => k + 1),
    [scale]
  );

  useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue, setValue]);

  return (
    <div className='text-dark-text'>
      <Typography className='mb-2' variant='h3'>
        {label}
      </Typography>
      <div className='flex flex-wrap justify-between items-center'>
        {array.map((value) => (
          <RateItem
            key={value}
            value={value}
            selected={selectedValue === value}
            setClicked={setSelectedValue}
          />
        ))}
      </div>
    </div>
  );
};

export default RateList;

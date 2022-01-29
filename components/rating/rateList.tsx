import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';

import Typography from '../typography';
import RateItem from './rateItem';

interface Props {
  label: string;
  // eslint-disable-next-line no-unused-vars
  setValue: (value: number | null) => void;
  scale: number;
  defaultValue?: number | null;
}

const RateList: FunctionComponent<Props> = ({
  scale,
  setValue,
  label,
  defaultValue,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(
    defaultValue || null
  );

  useEffect(() => {
    if (!defaultValue) return;
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const array = useMemo(
    () => Array.from({ length: scale }, (v, k) => k + 1),
    [scale]
  );

  useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue, setValue]);

  return (
    <div className="text-dark-text">
      <Typography className="mb-2" variant="h3">
        {label}
      </Typography>
      <div className="flex flex-wrap justify-between items-center">
        {array.map((value) => (
          <RateItem
            key={value}
            selected={selectedValue === value}
            setClicked={setSelectedValue}
            value={value}
          />
        ))}
      </div>
    </div>
  );
};

RateList.defaultProps = {
  defaultValue: null,
};

export default RateList;

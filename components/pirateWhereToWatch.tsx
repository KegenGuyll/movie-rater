import React, { FunctionComponent, useEffect, useState } from 'react';

import searchFMovie from '../endpoints/pirate/searchFMovies';
import searchNumberMovie from '../endpoints/pirate/searchNumberMovies';
import { FSearch, NumberSearch } from '../models/pirate';
import Logger from '../utils/logger';

interface Props {
  title: string;
}

const PirateWhereToWatch: FunctionComponent<Props> = ({ title }: Props) => {
  const [f, setF] = useState<FSearch[]>([]);
  const [number, setNumber] = useState<NumberSearch[]>([]);

  const fetchF = async (movie: string) => {
    try {
      const { res } = await searchFMovie(movie);

      if (res) {
        setF(res.data);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const fetchNumber = async (movie: string) => {
    try {
      const { res } = await searchNumberMovie(movie);

      if (res) {
        setNumber(res.data);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  useEffect(() => {
    if (!title) return;

    fetchF(title);
    fetchNumber(title);
  }, [title]);

  return (
    <div className="flex xs:mt-1 lg:mt-8  xs:space-x-1 lg:space-x-8">
      {!!f.length && (
        <button
          className="flex flex-wrap items-center bg-dark-light rounded p-3 max-w-max "
          type="button"
          onClick={() => window.open(f[0].url)}
        >
          <div className="w-20 h-10 flex items-center">
            <img
              alt={f[0].uuid}
              className="object-contain object-left-center"
              height="inherit"
              src="/img/f-movies-logo.png"
              style={{
                height: 'inherit',
                maxHeight: 'inherit',
                width: 'inherit',
              }}
              width="inherit"
            />
          </div>
        </button>
      )}
      {!!number.length && (
        <button
          className="flex flex-wrap items-center bg-dark-light  rounded p-3 max-w-max"
          type="button"
          onClick={() => window.open(number[0].url)}
        >
          <div className="w-20 h-10 flex items-center">
            <img
              alt={number[0].uuid}
              className="object-contain object-left-center"
              height="inherit"
              src="/img/123-movies-logo.svg"
              style={{
                height: 'inherit',
                maxHeight: 'inherit',
                width: 'inherit',
              }}
              width="inherit"
            />
          </div>
        </button>
      )}
    </div>
  );
};

export default PirateWhereToWatch;

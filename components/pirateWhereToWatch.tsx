import { FunctionComponent, useEffect, useState } from 'react';
import { FSearch, NumberSearch } from '../models/pirate';
import searchFMovie from '../endpoints/pirate/searchFMovies';
import searchNumberMovie from '../endpoints/pirate/searchNumberMovies';
import Typography from './typography';

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
      console.error(error);
    }
  };

  const fetchNumber = async (movie: string) => {
    try {
      const { res } = await searchNumberMovie(movie);

      if (res) {
        setNumber(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!title) return;

    fetchF(title);
    fetchNumber(title);
  }, [title]);

  return (
    <div className='flex xs:mt-1 lg:mt-8  xs:space-x-1 lg:space-x-8'>
      {!!f.length && (
        <button
          onClick={() => window.open(f[0].url)}
          className='flex flex-wrap items-center bg-dark-light rounded p-3 max-w-max '>
          <div className='w-20 h-10 flex items-center'>
            <img
              width={'inherit'}
              height={'inherit'}
              style={{
                width: 'inherit',
                maxHeight: 'inherit',
                height: 'inherit',
              }}
              className='object-contain object-left-center'
              alt={f[0].uuid}
              src={'/img/f-movies-logo.png'}
            />
          </div>
        </button>
      )}
      {!!number.length && (
        <button
          onClick={() => window.open(number[0].url)}
          className='flex flex-wrap items-center bg-dark-light  rounded p-3 max-w-max'>
          <div className='w-20 h-10 flex items-center'>
            <img
              width={'inherit'}
              height={'inherit'}
              style={{
                width: 'inherit',
                maxHeight: 'inherit',
                height: 'inherit',
              }}
              className='object-contain object-left-center'
              alt={number[0].uuid}
              src={'/img/123-movies-logo.svg'}
            />
          </div>
        </button>
      )}
    </div>
  );
};

export default PirateWhereToWatch;

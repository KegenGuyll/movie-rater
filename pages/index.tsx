import clsx from 'clsx';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Poster from '../components/movies/poster';
import Navigation from '../components/navigation';
import getIMDBPopular from '../endpoints/getPopular';
import { IMDBPopular } from '../models/imdb/popular';

const Home: NextPage = () => {
  const [popularMovies, setPopularMovies] = useState<IMDBPopular[] | null>(
    null
  );

  useEffect(() => {
    getIMDBPopular().then(({ res, err }) => {
      if (res) {
        setPopularMovies(res.data);
        return res.data;
      }
    });
  }, []);

  return (
    <>
      <Navigation />
      <section className='flex flex-col items-center'>
        <div
          className={clsx(
            'm-8 p-8 auto-cols-min w-max gap-2 md:gap-4',
            'grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 2xl:grid-cols-7'
          )}>
          {popularMovies?.map((value) => {
            return <Poster key={value.uuid} movie={value} />;
          })}
        </div>
      </section>
    </>
  );
};

export default Home;

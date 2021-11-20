import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import ImdbMeter from '../../components/imdbMeter';
import MediaCard from '../../components/mediaCard';
import MovieRating from '../../components/movies/rating';
import AudienceMeter from '../../components/rottenTomatoes/audience_meter';
import TomatoMeter from '../../components/rottenTomatoes/tomato_meter';
import Spinner from '../../components/spinner';
import Typography from '../../components/typography';
import getIMDBMovie from '../../endpoints/getImdbMovie';
import getRottenMovie from '../../endpoints/getRottenTomatoesMovie';
import getRottenTomatoesSearch from '../../endpoints/getRottenTomatoesSearch';
import { IMDBMovie } from '../../models/imdb/popular';
import { RottenMovie, RottenTomatoesSearch } from '../../models/rottenTomatoes';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

const Movie: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [movie, setMovie] = useState<RottenMovie | null>(null);
  const [rottenTomatoesSearch, setRottenTomatoesSearch] = useState<
    RottenTomatoesSearch[] | null
  >(null);
  const [imdb, setImdb] = useState<IMDBMovie | null>(null);
  const query = useMemo(() => router.query, [router.query]);

  useEffect(() => {
    if (!query.title || !query.year) return;

    setIsLoading(true);
    getRottenTomatoesSearch(
      query.title as string,
      'm',
      query.year as string
    ).then(({ res }) => {
      if (res) {
        setRottenTomatoesSearch(res.data);
        getRottenMovie(res.data[0].type, res.data[0].uuid).then(
          ({ res: rotten }) => {
            if (rotten) {
              setMovie(rotten.data);
            }
            if (!!query.imdbuuid) {
              getIMDBMovie('title', query.imdbuuid as string).then(
                ({ res: imdb }) => {
                  if (imdb) {
                    setImdb(imdb.data);
                  }
                }
              );
            }
          }
        );
      }
    });
    setIsLoading(false);
  }, [query]);

  if (!movie || isLoading) {
    return (
      <div className='h-screen w-full justify-center text-dark-text text-xl relative'>
        <div className='absolute bottom-1/2 top-1/2 m-auto right-1/2'>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col m-8 items-center overflow-hidden h-full relative'>
      <div className='h-96 w-56 rounded relative'>
        <Image
          className='rounded'
          layout='fill'
          objectFit='cover'
          src={movie.poster || movie.photos[0]}
          alt={movie.title}
          priority
        />
      </div>
      <div className='grid grid-cols-2 gap-2 w-full'>
        <MediaCard className='flex col-span-2 flex-col  items-center justify-center'>
          <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5 sm:items-center'>
            <MovieRating rating={movie.rating} />
            <Typography variant='h2'>{movie.title}</Typography>
            <Typography variant='legal'>2021</Typography>
          </div>
          <div className='flex flex-wrap mt-5 items-center'>
            {movie.movieInfo.genre.map((value) => {
              return (
                <div
                  className='border mx-3 my-2 border-dark-text py-1 px-3 rounded-3xl'
                  key={value}>
                  <Typography variant='light'>{value}</Typography>
                </div>
              );
            })}
          </div>
        </MediaCard>
        <MediaCard className='col-span-1'>
          <div className='flex items-center text-center border rounded border-dark-text border-dashed p-11'>
            <Typography>Rate this movie</Typography>
          </div>
        </MediaCard>
        <MediaCard className='col-span-1'>
          <div className='flex flex-col items-stretch'>
            <TomatoMeter
              rottenTomatoesScore={movie.tomatometerscore}
              rottenTomatoesStatus={movie.tomatometerstate as any}
            />
            <AudienceMeter
              rottenTomatoesScore={movie.audiencescore}
              rottenTomatoesStatus={movie.audiencestate as any}
            />
            {imdb && <ImdbMeter rating={imdb.score} />}
          </div>
        </MediaCard>
        <MediaCard className='col-span-2'>
          <div>
            <Typography>{movie.movieSynopsis}</Typography>
          </div>
        </MediaCard>
        <MediaCard className='col-span-1'>
          <div>
            <Typography className='mb-5' variant='h3'>
              Movie Info
            </Typography>
            {Object.keys(movie.movieInfo).map((value) => {
              if (value === 'rating' || value === 'genre') {
                return null;
              }
              return (
                <div className='my-5' key={value}>
                  <Typography variant='h4'>
                    {capitalizeFirstLetter(value).replace('-', ' ')} -{' '}
                  </Typography>
                  {(typeof (movie.movieInfo as any)[value] as any) ===
                  'string' ? (
                    <Typography variant='light' className='pl-3'>
                      {(movie.movieInfo as any)[value]}
                    </Typography>
                  ) : (
                    <ul>
                      {((movie.movieInfo as any)[value] as string[]).map(
                        (value: string, index) => {
                          return (
                            <li key={index}>
                              <Typography variant='light' className='pl-3'>
                                {value}
                              </Typography>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </MediaCard>
        <MediaCard>
          <Typography variant='h3'>Cast</Typography>
          {movie.cast.slice(0, 7).map((value, index) => (
            <div key={index} className='flex flex-wrap items-center my-5'>
              <div className='mr-5'>
                <Image
                  className=' rounded-full mr-3'
                  width={64}
                  height={64}
                  src={value.img}
                  alt={value.name}
                />
              </div>
              <div className='flex flex-col'>
                <Typography>{value.name}</Typography>
                {value.character.split(',').map((name, nameIndex) => (
                  <Typography key={nameIndex} variant='subtitle'>
                    {name}
                  </Typography>
                ))}
              </div>
            </div>
          ))}
        </MediaCard>
      </div>
    </div>
  );
};

export default Movie;

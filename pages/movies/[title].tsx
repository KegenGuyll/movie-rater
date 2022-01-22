import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import ImdbMeter from '../../components/imdbMeter';
import MediaCard from '../../components/mediaCard';
import Modal from '../../components/modal';
import MovieRating from '../../components/movies/rating';
import AudienceMeter from '../../components/rottenTomatoes/audience_meter';
import TomatoMeter from '../../components/rottenTomatoes/tomato_meter';
import Spinner from '../../components/spinner';
import Typography from '../../components/typography';
import getIMDBMovie from '../../endpoints/imdb/getImdbMovie';
import getRottenMovie from '../../endpoints/rotten/getRottenTomatoesMovie';
import getRottenTomatoesSearch from '../../endpoints/rotten/getRottenTomatoesSearch';
import { IMDBMovie } from '../../models/imdb/popular';
import { RottenMovie, RottenTomatoesSearch } from '../../models/rottenTomatoes';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import Rating from '../../components/rating';
import { useAuth } from '../../context/AuthUserContext';
import { MovieDocument } from '../../models/firestore';
import UserMeter from '../../components/userMeter';
import clsx from 'clsx';
import WhereToWatch from '../../components/whereToWatch';
import getReviewedMovie from '../../endpoints/review/getReviewMovie';
import Navigation from '../../components/navigation';
import Button from '../../components/button';
import Head from 'next/head';
import WatchListModal from '../../components/watch-lists/watchListModal';

const Movie: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [movie, setMovie] = useState<RottenMovie | null>(null);
  const [rottenTomatoesSearch, setRottenTomatoesSearch] = useState<
    RottenTomatoesSearch[] | null
  >(null);
  const [imdb, setImdb] = useState<IMDBMovie | null>(null);
  const query = useMemo(() => router.query, [router.query]);
  const [movieReview, setMovieReview] = useState<boolean>(false);
  const [advancedScoring, setAdvancedScoring] = useState<boolean>(false);
  const [documentMovie, setDocumentMovie] = useState<MovieDocument | null>(
    null
  );
  const { authUser } = useAuth();

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

  useEffect(() => {
    if (movie && authUser && movie.uuid) {
      authUser.getIdToken(true).then((token) => {
        getReviewedMovie(movie.uuid, token).then((value) => {
          if (value.res) {
            setDocumentMovie(value.res.data);
          }
        });
      });
    }
  }, [movie, authUser, movieReview]);

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
    <>
      <Head>
        <title>{`${movie.title} | ${query.year as string}`}</title>
        <meta name='description' content={movie.movieSynopsis} />
      </Head>
      <Navigation />
      <div
        className={clsx(
          'flex flex-col  m-8 lg:px-4  items-center',
          'lg:flex-row lg:items-start'
        )}>
        <div className='flex flex-col px-4 space-y-3'>
          <div className='h-96 w-56  lg:h-[500px] lg:w-[340px] rounded relative'>
            <Image
              className='rounded'
              layout='fill'
              objectFit='cover'
              src={imdb?.poster || movie.poster || movie.photos[0]}
              alt={movie.title}
              priority
            />
          </div>
          <WatchListModal
            rotten={movie}
            imdb={imdb}
            personal={documentMovie}
            title={movie.title}
            poster={imdb?.poster || movie.poster}
            year={Number(query.year)}
          />
          <Button
            onClick={() => setMovieReview(true)}
            className='hidden lg:block'
            variant='primary'>
            <Typography className='flex items-center' variant='h4'>
              <span className='material-icons-outlined mr-2'>rate_review</span>
              Add Review
            </Typography>
          </Button>
        </div>

        <div className='grid grid-cols-2 gap-2 w-full'>
          <MediaCard
            className={clsx(
              'flex col-span-2 flex-col items-center justify-center',
              'lg:justify-start lg:items-start'
            )}>
            <div
              className={clsx(
                'flex flex-row space-y-0 space-x-5 items-center',
                'lg:hidden'
              )}>
              <MovieRating rating={movie.rating} />
              <Typography variant='h2'>{movie.title}</Typography>
              <Typography variant='legal'>{query.year as string}</Typography>
            </div>
            <div className='block lg:grid lg:grid-rows-1 lg:grid-flow-col-dense lg:gap-3'>
              <div className={clsx('hidden', 'lg:flex lg:h-full')}>
                <div className='flex flex-col'>
                  <Typography variant='h2'>{movie.title}</Typography>
                  <div className='flex mt-2 items-center space-x-3'>
                    <MovieRating rating={movie.rating} />
                    <Typography>{query.year as string}</Typography>
                  </div>
                </div>
              </div>
              <div className='h-full w-full flex  items-center'>
                <div className='hidden lg:block 2xl:mx-4 lg:mx-2 border border-r border-dark-text h-24 w-0' />
              </div>
              <div
                className={clsx(
                  'flex flex-wrap mt-5 items-center',
                  'lg:mt-0 lg:items-start lg:grid lg:gap-1 lg:grid-cols-2 xl:grid-cols-3'
                )}>
                {movie.movieInfo.genre.map((value) => {
                  return (
                    <div
                      title={value}
                      className='border mx-3 my-2 truncate border-dark-text py-1 px-3 rounded-3xl'
                      key={value}>
                      <Typography variant='light'>{value}</Typography>
                    </div>
                  );
                })}
              </div>
            </div>
          </MediaCard>
          {!documentMovie && (
            <MediaCard className='block lg:hidden col-span-1'>
              <div
                onClick={() => setMovieReview(true)}
                className='flex items-center text-center border rounded border-dark-text border-dashed p-11'>
                <Typography>Rate this movie</Typography>
              </div>
            </MediaCard>
          )}
          <MediaCard
            title='Reviews'
            className={clsx(
              'col-span-1 gap-1',
              'lg:col-span-2 lg:gap-2  2xl:gap-4 2xl:col-span-1'
            )}>
            <div
              className={clsx(
                'flex flex-col items-stretch',
                'lg:grid lg:grid-rows-1 lg:grid-flow-col-dense'
              )}>
              <div>
                <Typography
                  className={clsx('hidden', 'lg:block mb-3')}
                  variant='h4'>
                  Rotten Tomatoes
                </Typography>
                <TomatoMeter
                  rottenTomatoesScore={movie.tomatometerscore}
                  rottenTomatoesStatus={movie.tomatometerstate as any}
                />
                <AudienceMeter
                  rottenTomatoesScore={movie.audiencescore}
                  rottenTomatoesStatus={movie.audiencestate as any}
                />
              </div>
              {imdb && (
                <div className='h-full w-full flex  items-center'>
                  <div className='hidden lg:block 2xl:mx-4 lg:mx-2 border border-r border-dark-text h-24 w-0' />
                </div>
              )}
              {imdb && (
                <div>
                  <Typography
                    className={clsx('hidden', 'lg:block mb-3')}
                    variant='h4'>
                    IMDb
                  </Typography>
                  <ImdbMeter rating={imdb.score} />
                </div>
              )}
              {documentMovie && authUser && (
                <div className='h-full w-full flex  items-center'>
                  <div className='hidden lg:block 2xl:mx-4 lg:mx-2 border border-r border-dark-text h-24 w-0' />
                </div>
              )}
              {documentMovie && authUser && (
                <div className='flex flex-col lg:items-center'>
                  <Typography
                    className={clsx('hidden', 'lg:block mb-3')}
                    variant='h4'>
                    Personal Score
                  </Typography>
                  <UserMeter
                    setMovieReview={setMovieReview}
                    documentMovie={documentMovie}
                    authUser={authUser}
                  />
                </div>
              )}
            </div>
          </MediaCard>
          {movie && !!movie.whereToWatch.length && (
            <MediaCard
              title='Where To Watch'
              className={clsx(
                documentMovie ? 'col-span-1' : 'col-span-2 lg:col-span-1'
              )}>
              <div
                className={clsx(
                  'grid grid-cols-1  xs:grid-cols-2  xs:gap-1 lg:gap-8',
                  documentMovie ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                )}>
                {movie.whereToWatch.map((value, key) => {
                  return (
                    <WhereToWatch
                      key={key}
                      provider={value.provider as any}
                      availability={value.availability}
                    />
                  );
                })}
              </div>
            </MediaCard>
          )}
          <MediaCard
            title='Synopsis'
            className={clsx('col-span-2', 'lg:col-auto')}>
            <Typography>{movie.movieSynopsis}</Typography>
          </MediaCard>
          <MediaCard title='Movie Info' className='col-span-1'>
            <div>
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
          <MediaCard title='Cast'>
            {movie.cast.slice(0, 7).map((value, index) => (
              <div key={index} className='flex flex-wrap items-center my-5'>
                <div className='mr-5'>
                  <Image
                    className=' rounded-full mr-3'
                    width={64}
                    height={64}
                    src={
                      value.img ||
                      `https://avatars.dicebear.com/api/bottts/${value.name}.svg`
                    }
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
      <Modal open={movieReview} setOpen={setMovieReview}>
        <div>
          <Rating
            defaultSimpleScore={documentMovie?.simpleScore}
            defaultScore={documentMovie?.advancedScore}
            closeModal={setMovieReview}
            movie={movie}
            imdb={imdb}
            advanceScore={advancedScoring}
            setAdvanceScore={setAdvancedScoring}
          />
        </div>
      </Modal>
    </>
  );
};

export default Movie;

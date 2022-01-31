import clsx from 'clsx';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import Button from '../../components/button';
import MediaCard from '../../components/mediaCard';
import Modal from '../../components/modal';
import CastCard from '../../components/movies/castCard';
import MovieRating from '../../components/movies/rating';
import ReviewCard from '../../components/movies/reviewCard';
import Navigation from '../../components/navigation';
import PirateWhereToWatch from '../../components/pirateWhereToWatch';
import Rating from '../../components/rating';
import Spinner from '../../components/spinner';
import Typography from '../../components/typography';
import WatchListModal from '../../components/watch-lists/watchListModal';
import WhereToWatch from '../../components/whereToWatch';
import { useAuth } from '../../context/AuthUserContext';
import getIMDBMovie from '../../endpoints/imdb/getImdbMovie';
import getReviewedMovie from '../../endpoints/review/getReviewMovie';
import getRottenMovie from '../../endpoints/rotten/getRottenTomatoesMovie';
import getRottenTomatoesSearch from '../../endpoints/rotten/getRottenTomatoesSearch';
import getFindExternalId from '../../endpoints/TMDB/getFindExternalId';
import getMovieDetails from '../../endpoints/TMDB/getMovie';
import getMovieCast from '../../endpoints/TMDB/getMovieCast';
import { MovieDocument } from '../../models/firestore';
import { IMDBMovie } from '../../models/imdb/popular';
import { RottenMovie } from '../../models/rottenTomatoes';
import { MovieCast, MovieDetails } from '../../models/TMDB';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import Logger from '../../utils/logger';

interface Props {
  details: MovieDetails | null;
  cast: MovieCast | null;
}

const Movie: NextPage<Props> = ({ details, cast }: Props) => {
  const router = useRouter();

  const [movie, setMovie] = useState<RottenMovie | null>(null);
  const [imdb, setImdb] = useState<IMDBMovie | null>(null);
  const query = useMemo(() => router.query, [router.query]);
  const [movieReview, setMovieReview] = useState<boolean>(false);
  const [advancedScoring, setAdvancedScoring] = useState<boolean>(false);
  const [documentMovie, setDocumentMovie] = useState<MovieDocument | null>(
    null
  );
  const { authUser } = useAuth();

  useEffect(() => {
  
    getRottenTomatoesSearch(
      // eslint-disable-next-line prettier/prettier
      query.title as string,
      'm',
      query.year as string
    ).then(({ res }) => {
      if (res) {
        getRottenMovie(res.data[0].type, res.data[0].uuid).then(
          ({ res: rotten }) => {
            if (rotten) {
              setMovie(rotten.data);
            }
            if (query.imdbuuid) {
              getIMDBMovie('title', query.imdbuuid as string).then(
                ({ res: imdbRes }) => {
                  if (imdbRes) {
                    setImdb(imdbRes.data);
                  }
                }
              );
            }
          }
        );
      }
    });
 
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

  if (!details) {
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
        <title>{`${details.title} | ${
          details.release_date.split('-')[0]
        }`}</title>
        <meta content={details.overview} name='description' />
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
              priority
              alt={details.title}
              className='rounded'
              layout='fill'
              objectFit='cover'
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
            />
          </div>
          {authUser && (
            <WatchListModal
              imdb={imdb}
              imdbId={details.imdb_id}
              imdbScore={details.vote_average}
              personal={documentMovie}
              poster={details.poster_path}
              rotten={movie}
              title={details.title}
              year={Number(query.year)}
            />
          )}
          {authUser && (
            <Button
              className='hidden lg:block'
              variant='primary'
              onClick={() => setMovieReview(true)}>
              <Typography className='flex items-center' variant='h4'>
                <span className='material-icons-outlined mr-2'>
                  rate_review
                </span>
                Add Review
              </Typography>
            </Button>
          )}
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
              <MovieRating rating={movie?.rating} />
              <Typography variant='h2'>{details.title}</Typography>
              <Typography variant='legal'>
                {details.release_date.split('-')[0]}
              </Typography>
            </div>
            <div className='block lg:grid lg:grid-rows-1 lg:grid-flow-col-dense lg:gap-3'>
              <div className={clsx('hidden', 'lg:flex lg:h-full')}>
                <div className='flex flex-col'>
                  <Typography variant='h2'>{details.title}</Typography>
                  <div className='flex mt-2 items-center space-x-3'>
                    <MovieRating rating={movie?.rating} />
                    <Typography>
                      {details.release_date.split('-')[0]}
                    </Typography>
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
                {details.genres.map((value) => (
                    <div
                      key={value.id}
                      className='border mx-3 my-2 truncate border-dark-text py-1 px-3 rounded-3xl'
                      title={value.name}>
                      <Typography variant='light'>{value.name}</Typography>
                    </div>
                  ))}
              </div>
            </div>
          </MediaCard>
          {!documentMovie && authUser && (
            <MediaCard className='block lg:hidden col-span-1'>
              <button
                className='flex items-center text-center border rounded border-dark-text border-dashed p-11'
                type='button'
                onClick={() => setMovieReview(true)}>
                <Typography>Rate this movie</Typography>
              </button>
            </MediaCard>
          )}
          <ReviewCard
            details={details}
            documentMovie={documentMovie}
            movie={movie}
            setMovieReview={setMovieReview}
          />
          {movie && !!movie.whereToWatch.length && (
            <MediaCard
              className={clsx(
                documentMovie ? 'col-span-1' : 'col-span-2 lg:col-span-1'
              )}
              title='Where To Watch'>
              <div
                className={clsx(
                  'grid grid-cols-1  xs:grid-cols-2  xs:gap-1 lg:gap-8',
                  documentMovie ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                )}>
                {movie.whereToWatch.map((value, key) => (
                    <WhereToWatch
                      // eslint-disable-next-line react/no-array-index-key
                      key={key}
                      availability={value.availability}
                      provider={value.provider as any}
                    />
                  ))}
              </div>
              <PirateWhereToWatch title={details.title} />
            </MediaCard>
          )}
          <MediaCard
            className={clsx('col-span-2', 'lg:col-auto')}
            title='Synopsis'>
            <Typography>{details.overview}</Typography>
          </MediaCard>
          {documentMovie && documentMovie.notes && (
            <MediaCard title='Personal Notes'>
              <Typography>{documentMovie.notes}</Typography>
            </MediaCard>
          )}
          {movie && (
            <MediaCard className='col-span-1' title='Movie Info'>
              {movie && movie.movieInfo && (
                <div>
                  {Object.keys(movie.movieInfo).map((value) => {
                    if (value === 'rating' || value === 'genre') {
                      return null;
                    }
                    return (
                      <div key={value} className='my-5'>
                        <Typography variant='h4'>
                          {capitalizeFirstLetter(value).replace('-', ' ')} -{' '}
                        </Typography>
                        {(typeof (movie.movieInfo as any)[value] as any) ===
                        'string' ? (
                          <Typography className='pl-3' variant='light'>
                            {(movie.movieInfo as any)[value]}
                          </Typography>
                        ) : (
                          <ul>
                            {((movie.movieInfo as any)[value] as string[]).map(
                              (info: string, index) => (
                                  // eslint-disable-next-line react/no-array-index-key
                                  <li key={index}>
                                    <Typography
                                      className='pl-3'
                                      variant='light'>
                                      {info}
                                    </Typography>
                                  </li>
                                )
                            )}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </MediaCard>
          )}

          <CastCard cast={cast} />
        </div>
      </div>
      <Modal open={movieReview} setOpen={setMovieReview}>
        <div>
          <Rating
            advanceScore={advancedScoring}
            closeModal={setMovieReview}
            defaultScore={documentMovie?.advancedScore}
            defaultSimpleScore={documentMovie?.simpleScore}
            imdb={imdb}
            movie={movie}
            setAdvanceScore={setAdvancedScoring}
          />
        </div>
      </Modal>
    </>
  );
};

Movie.getInitialProps = async (context) => {
  try {
    const { id, imdbuuid } = context.query;
    let existingId = '';

    if (imdbuuid) {
      const { res } = await getFindExternalId(imdbuuid as string, 'imdb_id');
      if (res) {
        existingId = String(res.data.movie_results[0].id);
      }
    }

    const { res: movieDetailsData } = await getMovieDetails(
      existingId || (id as string)
    );
    const { res: movieCastData } = await getMovieCast(
      existingId || (id as string)
    );

    if (movieCastData && movieDetailsData) {
      return {
        cast: movieCastData.data,
        details: movieDetailsData.data,
      };
    } 
      return {
        cast: null,
        details: null,
      };
    
  } catch (error) {
     Logger.error(error);

    return {
      cast: null,
      details: null,
    };
  }
};

export default Movie;

/* eslint-disable prettier/prettier */
import clsx from 'clsx';
import debounce from 'lodash.debounce';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';

import Navigation from '../components/navigation';
import Typography from '../components/typography';
import getMovieSearch from '../endpoints/TMDB/getMovieSearch';
import { Movie, Person, TV } from '../models/TMDB';
import formatTitleUrl from '../utils/formatTitleUrl';
import Logger from '../utils/logger';

const SearchPage: NextPage = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tv, setTv] = useState<TV[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  const [collapseMovies, setCollapseMovies] = useState<boolean>(false);
  const [collapseTv, setCollapseTv] = useState<boolean>(false);
  const [collapsePeople, setCollapsePeople] = useState<boolean>(false);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), []);

  const handleFetch = async (q: string) => {
    const { res, err } = await getMovieSearch(q);

    if (res) {
      const filteredMovie = res.data.results.filter(
        (movie) => movie.media_type === "movie"
      ) as unknown as Movie[];
      setMovies(filteredMovie);
      const filteredTv = res.data.results.filter(
        (movie) => movie.media_type === "tv"
      ) as unknown as TV[];
      setTv(filteredTv);
      const filteredPeople = res.data.results.filter(
        (movie) => movie.media_type === "person"
      ) as unknown as Person[];
      setPeople(filteredPeople);
    }

    if (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    if (!query) return;

    handleFetch(query);
  }, [query]);

  return (
    <div>
      <Navigation />
      <div className="px-3 text-dark-text space-y-3">
        <Typography variant="h1">Search</Typography>
        <input
          aria-label="search box"
          className={clsx(
            'py-[7px] px-3 w-full bg-dark-components rounded',
            'focus:border focus:border-cta transition-colors duration-300 focus:outline-none'
          )}
          placeholder="start a search..."
          onChange={debouncedChangeHandler}
        />
        {!!movies.length && (
          <div>
            <button
              className="flex items-center mb-2 w-full text-left"
              type="button"
              onClick={() => setCollapseMovies(!collapseMovies)}
            >
              <Typography className="flex-grow" variant="h2">
                Movies
              </Typography>
              <div className="flex items-center justify-center">
                <span className="material-icons-outlined">
                  {!collapseMovies ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            </button>

            {!collapseMovies &&
              movies.map((value) => (
                <Link
                  key={value.id}
                  passHref
                  href={`/movie/${formatTitleUrl(value.title, value.id)}`}
                >
                  <a>
                    <div className="flex">
                      <div className="flex-grow">
                        <Image
                          alt={value.title}
                          blurDataURL={`https://image.tmdb.org/t/p/w100${value.poster_path}`}
                          className="rounded"
                          height="100"
                          src={`https://image.tmdb.org/t/p/w300${value.poster_path}`}
                          width="60"
                        />
                      </div>
                      <div className=" flex-grow w-full ml-5">
                        <Typography variant="h4">{value.title} </Typography>
                        <Typography>
                          {value.release_date &&
                            value.release_date.split('-')[0]}
                        </Typography>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
          </div>
        )}
        {!!tv.length && (
          <div>
            <button
              className="flex items-center mb-2 w-full text-left"
              type="button"
              onClick={() => setCollapseTv(!collapseTv)}
            >
              <Typography className="flex-grow" variant="h2">
                Tv
              </Typography>
              <div className="flex items-center justify-center">
                <span className="material-icons-outlined">
                  {!collapseTv ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            </button>
            {!collapseTv &&
              tv.map((value) => (
                <Link
                  key={value.id}
                  passHref
                  href={`/tv/${formatTitleUrl(value.name, value.id)}`}
                >
                  <a>
                    <div className="flex">
                      <div className="flex-grow">
                        <Image
                          alt={value.name}
                          blurDataURL={`https://image.tmdb.org/t/p/w100${value.poster_path}`}
                          className="rounded"
                          height="100"
                          src={`https://image.tmdb.org/t/p/w300${value.poster_path}`}
                          width="60"
                        />
                      </div>
                      <div className=" flex-grow w-full ml-5">
                        <Typography variant="h4">{value.name} </Typography>
                        <Typography>
                          {value.first_air_date &&
                            value.first_air_date.split('-')[0]}
                        </Typography>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
          </div>
        )}
        {!!people.length && (
          <div>
            <button
              className="flex items-center mb-2 w-full text-left"
              type="button"
              onClick={() => setCollapsePeople(!collapsePeople)}
            >
              <Typography className="flex-grow" variant="h2">
                People
              </Typography>
              <div className="flex items-center justify-center">
                <span className="material-icons-outlined">
                  {!collapsePeople ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            </button>
            {!collapsePeople &&
              people.map((value) => (
                <Link
                  key={value.id}
                  passHref
                  href={`/person/${formatTitleUrl(value.name, value.id)}`}
                >
                  <a>
                    <div className="flex">
                      <div className="flex-grow">
                        <Image
                          alt={value.name}
                          blurDataURL={`https://image.tmdb.org/t/p/w100${value.profile_path}`}
                          className="rounded"
                          height="100"
                          src={`https://image.tmdb.org/t/p/w300${value.profile_path}`}
                          width="60"
                        />
                      </div>
                      <div className=" flex-grow w-full ml-5">
                        <Typography variant="h4">{value.name} </Typography>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

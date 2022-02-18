import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import Navigation from '../../components/navigation';
import Typography from '../../components/typography';
import getMovieDetails from '../../endpoints/TMDB/getMovie';
import getPersonCombinedCredits from '../../endpoints/TMDB/person/getPersonCombinedCredits';
import getPersonDetails from '../../endpoints/TMDB/person/getPersonDetails';
import getTVDetails from '../../endpoints/TMDB/tv/getTvDetails';
import { MovieDetails } from '../../models/TMDB';
import {
  Cast,
  PersonCombinedCredits,
  PersonDetails,
} from '../../models/TMDB/person';
import { TVDetails } from '../../models/TMDB/tv';
import { findGender, parseYear } from '../../utils/common';
import formatTitleUrl from '../../utils/formatTitleUrl';
import imageUrl from '../../utils/imageUrl';
import Logger from '../../utils/logger';

interface Props {
  details: PersonDetails | null;
  combinedCredits: PersonCombinedCredits | null;
}

type AllVotes = {
  id: number,
  media_type: 'movie' | 'tv',
  score: number,
};

const PersonPage: NextPage<Props> = ({ details, combinedCredits }: Props) => {
  const [topRated, setTopRated] = useState<MovieDetails | TVDetails>();
  const [lowestRated, setLowestRated] = useState<MovieDetails | TVDetails>();
  const [sortedCredits, setSortedCredits] = useState<Cast[]>();

  if (!details || !combinedCredits) return null;

  const findRated = async () => {
    const all = [...combinedCredits.cast];
    const allVotes: AllVotes[] = [];

    all.forEach((value) => {
      if (value.vote_average) {
        allVotes.push({
          id: value.id,
          media_type: value.media_type,
          score: value.vote_average,
        });
      }
    });

    const minMax = allVotes.sort((a, b) => a.score - b.score);

    const max = minMax[minMax.length - 1];
    const min = minMax[0];

    if (max.media_type === 'movie') {
      const { res } = await getMovieDetails(max.id.toString());
      if (res) {
        res.data.media_type = 'movie';
        setTopRated(res.data);
      }
    } else {
      const { res } = await getTVDetails(max.id.toString());

      if (res) {
        res.data.media_type = 'tv';
        setTopRated(res.data);
      }
    }

    if (min.media_type === 'movie') {
      const { res } = await getMovieDetails(min.id.toString());
      if (res) {
        res.data.media_type = 'movie';
        setLowestRated(res.data);
      }
    } else {
      const { res } = await getTVDetails(min.id.toString());

      if (res) {
        res.data.media_type = 'tv';
        setLowestRated(res.data);
      }
    }
  };

  useEffect(() => {
    findRated();
  }, [combinedCredits]);

  useEffect(() => {
    if (combinedCredits) {
      const sorted = combinedCredits.cast.sort((a, b) => {
        if (a.popularity > b.popularity) {
          return -1;
        }

        if (a.popularity < b.popularity) {
          return 1;
        }
        return 0;
      });

      setSortedCredits(sorted);
    }
  }, [combinedCredits]);

  const renderMinMaxRating = () => (
    <div className=" space-y-3">
      {topRated && topRated.media_type === 'movie' && (
        <span className="flex items-center space-x-2">
          <Typography variant="subtitle">Highest Rated: </Typography>
          <Typography variant="h4">{topRated.vote_average}</Typography>
          <Link
            passHref
            href={`/movie/${formatTitleUrl(topRated.title, topRated.id)}`}
          >
            <a className=" text-cta hover:underline font-bold">
              <Typography variant="h4">
                {topRated.title} ({parseYear(topRated.release_date)})
              </Typography>
            </a>
          </Link>
        </span>
      )}
      {topRated && topRated.media_type === 'tv' && (
        <span className="flex items-center space-x-2">
          <Typography variant="subtitle">Highest Rated: </Typography>
          <Typography variant="h4">{topRated.vote_average}</Typography>
          <Link
            passHref
            href={`/tv/${formatTitleUrl(topRated.name, topRated.id)}`}
          >
            <a className="text-cta hover:underline font-bold">
              <Typography variant="h4">
                {topRated.name} ({parseYear(topRated.first_air_date)} -{' '}
                {parseYear(topRated.last_air_date)})
              </Typography>
            </a>
          </Link>
        </span>
      )}
      {lowestRated && lowestRated.media_type === 'movie' && (
        <span className="flex items-center space-x-2">
          <Typography variant="subtitle">Lowest Rated</Typography>
          <Typography variant="h4">{lowestRated.vote_average}</Typography>
          <Link
            passHref
            href={`/movie/${formatTitleUrl(lowestRated.title, lowestRated.id)}`}
          >
            <a className="text-cta hover:underline font-bold">
              <Typography variant="h4">
                {lowestRated.title} ({parseYear(lowestRated.release_date)})
              </Typography>
            </a>
          </Link>
        </span>
      )}
      {lowestRated && lowestRated.media_type === 'tv' && (
        <span className="flex items-center space-x-2">
          <Typography variant="subtitle">Highest Rated</Typography>
          <Typography variant="h4">{lowestRated.vote_average}</Typography>
          <Link
            passHref
            href={`/tv/${formatTitleUrl(lowestRated.name, lowestRated.id)}`}
          >
            <a className="text-cta hover:underline font-bold">
              <Typography variant="h4">
                {' '}
                {lowestRated.name} ({parseYear(lowestRated.first_air_date)} -{' '}
                {parseYear(lowestRated.last_air_date)})
              </Typography>
            </a>
          </Link>
        </span>
      )}
    </div>
  );

  return (
    <>
      <Head>
        <title>{details.name}</title>
        <meta content={details.biography} name="description" />
      </Head>
      <Navigation />
      <div className=" grid grid-cols-4 px-14 text-dark-text">
        <div>
          <div>
            <Image
              alt={details.name}
              className="rounded"
              height={363}
              src={`${imageUrl(300, false)}/${details.profile_path}`}
              width={282}
            />
          </div>
          <div className="space-y-6 mt-6">
            <Typography variant="h2">Person Info</Typography>
            <div>
              <Typography variant="h3">Known For</Typography>
              <Typography variant="subtitle">
                {details.known_for_department}
              </Typography>
            </div>
            <div>
              <Typography variant="h3">Known Credits</Typography>
              <Typography variant="subtitle">
                {combinedCredits.cast.length + combinedCredits.crew.length}
              </Typography>
            </div>
            <div>
              <Typography variant="h3">Gender</Typography>
              <Typography variant="subtitle">
                {findGender(details.gender)}
              </Typography>
            </div>
            <div>
              <Typography variant="h3">Birthday</Typography>
              <Typography variant="subtitle">{details.birthday}</Typography>
            </div>
            <div>
              <Typography variant="h3">Place of birth</Typography>
              <Typography variant="subtitle">
                {details.place_of_birth}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start w-full col-span-3 space-y-6">
          <Typography variant="h1">{details.name}</Typography>
          {renderMinMaxRating()}
          {details.biography && (
            <div className="space-y-3">
              <Typography variant="h2">Biography</Typography>
              <Typography variant="subtitle">{details.biography}</Typography>
            </div>
          )}
          <div className="space-y-6">
            <Typography variant="h2">Most Popular Movies</Typography>
            <div className="grid grid-rows-1 grid-flow-col overflow-auto  gap-3 pb-3">
              {sortedCredits &&
                sortedCredits.slice(0, 15).map((cast) => {
                  if (!cast.poster_path || cast.media_type === 'tv')
                    return null;
                  return (
                    <Link
                      key={cast.id}
                      passHref
                      href={`/movie/${formatTitleUrl(cast.title, cast.id)}`}
                    >
                      <a className="flex flex-col items-center justify-center w-32">
                        <div className="h-full text-center">
                          <div className=" w-32 h-48 relative py-2">
                            <Image
                              className="rounded"
                              layout="fill"
                              objectFit="contain"
                              src={`${imageUrl(300)}${cast.poster_path}`}
                            />
                          </div>
                          <Typography>{cast.title}</Typography>
                        </div>
                      </a>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

PersonPage.getInitialProps = async (context) => {
  try {
    const { name } = context.query;

    if (!name || typeof name !== 'string') {
      throw new Error(`name broken: ${name}`);
    }

    const id = name.split('-')[0];

    const { res: personDetails } = await getPersonDetails(id);
    const { res: personCombinedCredits } = await getPersonCombinedCredits(id);

    return {
      combinedCredits: personCombinedCredits && personCombinedCredits.data,
      details: personDetails && personDetails.data,
    };
  } catch (error) {
    Logger.error(error);

    return {
      combinedCredits: null,
      details: null,
    };
  }
};

export default PersonPage;

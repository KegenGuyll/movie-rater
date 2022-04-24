import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { FunctionComponent, useEffect, useState } from 'react';

import getMovieDetails from '../../endpoints/TMDB/getMovie';
import getTVDetails from '../../endpoints/TMDB/tv/getTvDetails';
import { MovieDocument } from '../../models/firestore';
import RadialBarChart from '../charts/radialbarChart';
import Typography from '../typography';
import UserImage from '../userImage';

interface Props {
  films: MovieDocument[];
}

const FollowerFeedComponent: FunctionComponent<Props> = ({ films }) => {
  const [lists, setLists] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(true);

  const sortList = (a: MovieDocument, b: MovieDocument) => {
    if (a.createdAt.seconds > b.createdAt.seconds) {
      return -1;
    }

    if (a.createdAt.seconds < b.createdAt.seconds) {
      return 1;
    }

    return 0;
  };

  const fetchMovies = async () => {
    if (!films) return;

    if (films.length) {
      films.forEach(async (film) => {
        if (film.tmdbID) {
          const { res, err } = await getMovieDetails(film.tmdbID.toString());
          if (res) {
            const payload = {
              ...res.data,
              ...film,
            };

            res.data.media_type = 'movie';
            setLists((prevState) => [...prevState, payload]);
          }
          if (err) {
            const { res: tvDetails } = await getTVDetails(film.tmdbID);

            if (tvDetails) {
              const payload = {
                ...tvDetails.data,
                ...film,
              };
              tvDetails.data.media_type = 'tv';
              setLists((prevState) => [...prevState, payload]);
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    if (!films) return;

    if (films.length <= lists.length) return;

    fetchMovies();
  }, [films]);

  return (
    <div className="flex flex-col p-8 space-y-8 mt-20">
      <button
        className="flex items-center text-left w-full p-2 rounded hover:bg-dark-components"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <Typography className=" text-cta flex-grow" variant="h2">
          Follower Feed
        </Typography>
        <span className="material-icons-outlined text-dark-text">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {open && (
        <div className="flex items-center">
          <div
            className={clsx(
              ' py-2 w-max gap-2 md:gap-4',
              'grid grid-flow-col overflow-auto',
            )}
          >
            {films
              && lists.length
              && lists.sort(sortList).map((list) => (
                <div key={list._id} className="relative">
                  <Link passHref href={`/user/${list.userId}`}>
                    <a>
                      <div className="bg-black cursor-pointer w-32 h-52 md:w-48 md:h-80 rounded relative">
                        <Image
                          alt={list.title}
                          blurDataURL={`https://image.tmdb.org/t/p/w100${list.poster_path}`}
                          className="rounded object-fill select-none"
                          layout="fill"
                          objectFit="fill"
                          src={`https://image.tmdb.org/t/p/w500${list.poster_path}`}
                        />
                      </div>
                      <div className=" h-16 w-16 bg-dark-components rounded-full p-1 text-dark-text absolute top-1 right-1">
                        <RadialBarChart
                          score={
                            (list.averagedAdvancedScore || list.simpleScore)
                            * 10
                          }
                        />
                      </div>

                      <div className="bg-dark-components rounded-full p-1 absolute bottom-1 left-1">
                        <div className=" flex items-center justify-center relative h-16 w-16">
                          <UserImage userId={list.userId} />
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowerFeedComponent;

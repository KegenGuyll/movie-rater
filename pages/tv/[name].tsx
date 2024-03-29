/* eslint-disable @typescript-eslint/no-shadow */
import clsx from 'clsx';
import ISO6391 from 'iso-639-1';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Button from '../../components/button';
import CopyLink from '../../components/copyLink';
import MetaTags from '../../components/metaTags';
import Modal from '../../components/modal';
import Poster from '../../components/movies/poster';
import Navigation from '../../components/navigation';
import Rating from '../../components/rating';
import Typography from '../../components/typography';
import WatchListModal from '../../components/watch-lists/watchListModal';
import { useAuth } from '../../context/AuthUserContext';
import getReviewedMovie from '../../endpoints/review/getReviewMovie';
import getTVCast from '../../endpoints/TMDB/tv/getTvCast';
import getTVDetails from '../../endpoints/TMDB/tv/getTvDetails';
import getTVImages from '../../endpoints/TMDB/tv/getTvImages';
import getTVKeywords from '../../endpoints/TMDB/tv/getTvKeywords';
import getTVSimilar from '../../endpoints/TMDB/tv/getTvSimilar';
import getTVvideos from '../../endpoints/TMDB/tv/getTvVideos';
import { MovieDocument } from '../../models/firestore';
import {
  Backdrops,
  Cast,
  Keyword,
  Poster as PosterType,
  Video,
} from '../../models/TMDB';
import { TVDetails, TvSimilar } from '../../models/TMDB/tv';
import { formatTitle, parseYear } from '../../utils/common';
import formatTitleUrl from '../../utils/formatTitleUrl';
import imageUrl from '../../utils/imageUrl';
import Logger from '../../utils/logger';

const RadialBarChart = dynamic(
  () => import('../../components/charts/radialbarChart'),
  { ssr: false },
);

interface Props {
  details: TVDetails | null;
  casts: Cast[] | null;
  similarTv: TvSimilar | null;
  keywords: Keyword[] | null;
}

type MediaType = 'videos' | 'backdrops' | 'posters' | '';

type CombineMedia = PosterType | Backdrops;

export async function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://tmrev.io',
      permanent: false,
    },
  };
}

const TVshow: NextPage<Props> = ({
  details,
  casts,
  similarTv,
  keywords,
}: Props) => {
  const [advancedScoring, setAdvancedScoring] = useState<boolean>(true);
  const [movieReview, setMovieReview] = useState<boolean>(false);
  const [userData, setUserData] = useState<MovieDocument>();
  const [posters, setPosters] = useState<PosterType[]>([]);
  const [backdrops, setBackdrops] = useState<Backdrops[]>([]);
  const [videos, setVideos] = useState<Video[]>();
  const [activeMedia, setActiveMedia] = useState<MediaType>('');
  const router = useRouter();
  const { authUser } = useAuth();

  const sortVotes = (a: CombineMedia, b: CombineMedia) => b.vote_average - a.vote_average;

  const handleShallowRoute = (media: MediaType) => {
    if (details) {
      router.push(
        `/tv/${formatTitleUrl(details.name, details.id)}?${media}=true`,
        undefined,
        {
          shallow: true,
        },
      );
      setActiveMedia(media);
    }
  };

  const fetchUserData = async () => {
    if (authUser && details) {
      const authToken = await authUser.getIdToken();

      const { res, err } = await getReviewedMovie(details.id, authToken);

      if (res) {
        setUserData(res.data);
      }

      if (err) {
        Logger.error(err);
      }
    }
  };

  const fetchImages = async (tvId: number) => {
    const { res, err } = await getTVImages(tvId);

    if (res) {
      setPosters(res.data.posters.sort(sortVotes));
      setBackdrops(res.data.backdrops.sort(sortVotes));
    }

    if (err) {
      Logger.error(err);
    }
  };

  const fetchVideos = async (tvId: number) => {
    const { res, err } = await getTVvideos(tvId);

    if (res) {
      setVideos(res.data.results);
    }

    if (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [router.query.title, details, authUser]);

  const refreshData = () => {
    fetchUserData();
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const {
      backdrops, posters, title, videos,
    } = router.query;
    if ((backdrops || posters) && title && typeof title === 'string') {
      fetchImages(Number(title.split('-')[0]));
      if (backdrops) {
        setActiveMedia('backdrops');
      } else if (posters) {
        setActiveMedia('posters');
      }
    }
    if (videos && title && typeof title === 'string') {
      fetchVideos(Number(title.split('-')[0]));
      setActiveMedia('videos');
    }
  }, [router.query]);

  if (!details) {
    return (
      <div className="h-screen w-screen flex justify-start items-center">
        <Typography className="text-white" variant="h1">
          404 Movie could not be found
        </Typography>
      </div>
    );
  }

  const renderCoverImage = () => (
    <div
      className={clsx(
        'relative w-full overflow-hidden',
        'h-[265px] md:h-[400px] lg:h-[600px] xl:h-[800px]',
      )}
    >
      <Image
        priority
        alt={`${details.name} backdrop`}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        src={`${imageUrl(100, false)}${details.backdrop_path}`}
      />
      <div
        className={clsx(
          ' w-full bg-dark-background bg-opacity-70 absolute top-0',
          'h-[265px] md:h-[400px] lg:h-[600px] xl:h-[800px]',
        )}
      />
      <div className={clsx('flex p-8 xl:p-32')}>
        <div
          className={clsx(
            'relative flex flex-col',
            'h-[175px] w-[115px] md:h-[250px] md:w-[160px] lg:h-[400px] lg:w-[250px]  xl:h-[500px] xl:w-[331px]',
          )}
        >
          <Image
            alt={`${details.name} poster`}
            className="rounded"
            layout="fill"
            objectFit="cover"
            objectPosition={0}
            src={`${imageUrl(500)}${details.poster_path}`}
          />
          {authUser && (
            <WatchListModal
              className="hidden lg:block absolute w-full -bottom-12"
              media={details}
              personal={null}
            />
          )}
          {authUser && (
            <Button
              className="hidden lg:block  absolute -bottom-24 w-full"
              variant="primary"
              onClick={() => setMovieReview(true)}
            >
              <Typography className="flex items-center" variant="subtitle">
                <span className="material-icons-outlined mr-2">
                  rate_review
                </span>
                Add Review
              </Typography>
            </Button>
          )}
        </div>
        <div className="hidden lg:flex flex-col relative h-max flex-grow space-y-10 text-white ml-16">
          <div className="flex items-center space-x-4 ">
            <Typography className="max-w-md xl:max-w-xl" variant="h1">
              {details.name}
            </Typography>
            <Typography variant="h3">
              {`${parseYear(details.first_air_date)}`}
            </Typography>
            <CopyLink link={router.asPath} />
          </div>
          <div className="flex items-center">
            <div className="w-16 h-16 bg-dark-components p-1 rounded-full mr-3">
              {userData && userData.averagedAdvancedScore ? (
                <RadialBarChart score={userData.averagedAdvancedScore * 10} />
              ) : (
                <RadialBarChart score={details.vote_average * 10} />
              )}
            </div>
            <Typography className="w-16 mr-9" variant="h3">
              {userData ? 'User Score' : 'Audience Score'}
            </Typography>
            <div className="flex items-center space-x-3">
              <span className="material-icons-outlined text-3xl">
                play_circle_filled
              </span>
              <Typography variant="subtitle">Play Trailer</Typography>
            </div>
          </div>
          <div className="space-y-2">
            <Typography variant="h3">Overview</Typography>
            <Typography className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
              {details.overview}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div className="block lg:hidden">
      <div className="flex flex-col lg:hidden text-white p-10 bg-dark-components">
        <div className="flex text-center w-full items-center justify-center space-x-3">
          <Typography variant="h2">{details.name}</Typography>
          <Typography variant="subtitle">
            {`(${parseYear(details.first_air_date)})`}
          </Typography>
          <CopyLink link={router.asPath} />
        </div>
        <div className="flex mt-8 items-center justify-center">
          {authUser && <WatchListModal media={details} personal={null} />}
          {authUser && (
            <Button
              className="text-dark-background"
              variant="primary"
              onClick={() => setMovieReview(true)}
            >
              <Typography className="flex items-center" variant="h4">
                <span className="material-icons-outlined mr-2">
                  rate_review
                </span>
                Add Review
              </Typography>
            </Button>
          )}
        </div>
        <div className="text-left mt-8 space-y-3">
          <Typography variant="h3">Overview</Typography>
          <Typography>{details.overview}</Typography>
        </div>
      </div>
      {casts && !!casts.length && (
        <div className="mt-8 space-y-3 lg:p-16 p-4  text-dark-text">
          <Typography variant="h3">Cast</Typography>
          <div className="grid grid-rows-1 gap-2 grid-flow-col overflow-scroll">
            {casts.map((cast) => (
              <Link
                key={cast.id}
                passHref
                href={`/person/${formatTitleUrl(cast.name, cast.id)}`}
              >
                <a>
                  <div className="bg-dark-components rounded w-52">
                    <div className="relative h-[180px] w-full">
                      <Image
                        alt={cast.name}
                        className="rounded-t"
                        layout="fill"
                        objectFit="cover"
                        src={`${imageUrl(200)}${cast.profile_path}`}
                      />
                    </div>
                    <div className="p-2">
                      <Typography variant="h4">{cast.name}</Typography>
                      <Typography variant="subtitle">{`${cast.character}`}</Typography>
                      <Typography variant="light">
                        {`(${cast.known_for_department})`}
                      </Typography>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8 space-y-3 lg:p-16 p-4  text-dark-text">
        <div className="flex items-center">
          <Typography variant="h3">Media</Typography>
          <div className="flex space-x-4 pl-4">
            <button
              className={clsx(
                'hover:underline decoration-cta',
                activeMedia === 'videos' && 'underline',
              )}
              type="button"
              onClick={() => handleShallowRoute('videos')}
            >
              <Typography>Videos</Typography>
            </button>
            <button
              className={clsx(
                'hover:underline decoration-cta',
                activeMedia === 'backdrops' && 'underline',
              )}
              type="button"
              onClick={() => handleShallowRoute('backdrops')}
            >
              <Typography>Backdrops</Typography>
            </button>
            <button
              className={clsx(
                'hover:underline decoration-cta',
                activeMedia === 'posters' && 'underline',
              )}
              type="button"
              onClick={() => handleShallowRoute('posters')}
            >
              <Typography>Posters</Typography>
            </button>
          </div>
        </div>
        <div>
          {activeMedia === 'videos' && videos && (
            <div className="grid gap-2">
              {videos.slice(0, 2).map((video) => (
                <div
                  key={video.id}
                  className="h-[200px] md:h-[400px] relative w-full"
                >
                  <iframe
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="rounded"
                    frameBorder="0"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    width="100%"
                  />
                </div>
              ))}
            </div>
          )}
          {activeMedia === 'backdrops' && (
            <div className="grid gap-2">
              {backdrops.slice(0, 2).map((backdrop) => (
                <Link
                  key={backdrop.file_path}
                  passHref
                  href={`${imageUrl(100, false)}${backdrop.file_path}`}
                >
                  <a>
                    <div className="h-[200px] md:h-[400px] relative w-full">
                      <Image
                        alt="backdrops"
                        className="rounded"
                        layout="fill"
                        objectFit="cover"
                        src={`${imageUrl(500)}${backdrop.file_path}`}
                      />
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
          {activeMedia === 'posters' && (
            <div className="grid grid-cols-3 gap-2">
              {posters.slice(0, 5).map((poster) => (
                <Link
                  key={poster.file_path}
                  passHref
                  href={`${imageUrl(100, false)}${poster.file_path}`}
                >
                  <a id={poster.file_path}>
                    <div className="h-40 md:h-[320px] md:w-[224px] relative w-28">
                      <Image
                        alt="poster"
                        className="rounded"
                        layout="fill"
                        objectFit="cover"
                        src={`${imageUrl(200)}${poster.file_path}`}
                      />
                    </div>
                  </a>
                </Link>
              ))}
              <div className="flex items-center md:h-[320px] md:w-[224px] justify-center rounded text-dark-text h-40 relative w-28 bg-dark-components">
                <Typography> View all Posters </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
      {similarTv && (
        <div className="mt-8 space-y-3 lg:p-16 p-4  text-dark-text">
          <Typography variant="h3">Similar Movies</Typography>
          <div className="grid grid-rows-1 gap-2 grid-flow-col overflow-scroll">
            {similarTv.results.map((tv) => (
              <Link
                key={tv.id}
                passHref
                href={`/tv/${formatTitleUrl(tv.name, tv.id)}&videos=true`}
              >
                <a id={tv.original_name}>
                  <div className=" h-48 md:h-[320px] md:w-[224px] relative w-28">
                    <Image
                      alt="poster"
                      className="rounded"
                      layout="fill"
                      objectFit="cover"
                      src={`${imageUrl(200)}${tv.poster_path}`}
                    />
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderWebView = () => (
    <div className="hidden lg:grid grid-cols-4 gap-4 px-8">
      <div className="col-span-3 h-screen">
        {casts && !!casts.length && (
          <div className="mt-8 text-dark-text">
            <Typography variant="h3">Top Billed Cast</Typography>
            <div className="grid grid-rows-1 gap-2 grid-flow-col overflow-scroll py-3">
              {casts.slice(0, 9).map((cast) => (
                <Link
                  key={cast.id}
                  passHref
                  href={`/person/${formatTitleUrl(cast.name, cast.id)}`}
                >
                  <a className="h-full bg-dark-components  rounded w-52">
                    <div className="relative h-[180px] w-full">
                      <Image
                        alt={cast.name}
                        className="rounded-t"
                        layout="fill"
                        objectFit="cover"
                        src={`${imageUrl(200)}${cast.profile_path}`}
                      />
                    </div>
                    <div className="p-2">
                      <Typography variant="h4">{cast.name}</Typography>
                      <Typography variant="subtitle">{`${cast.character}`}</Typography>
                      <Typography variant="light">
                        {`(${cast.known_for_department})`}
                      </Typography>
                    </div>
                  </a>
                </Link>
              ))}
              <div className="flex items-center justify-center h-[290px] w-[160px] bg-dark-components rounded">
                {/* TODO: Create Cast and Crew Page */}
                <Link passHref href="/">
                  <a className="hover:underline" id="View full Cast and Crew">
                    <Typography>View full Cast and Crew</Typography>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
        {userData && authUser && userData.notes && (
          <div className="mt-8 text-dark-text space-y-3">
            <Typography variant="h3">Social</Typography>
            <div className=" bg-dark-components rounded p-4">
              <div className="flex items-center space-x-3 my-3">
                <Image
                  className="rounded-full"
                  height={64}
                  src={
                    authUser.photoURL
                    || `https://avatars.dicebear.com/api/initials/${
                      authUser.displayName || authUser.email
                    }.svg`
                  }
                  width={64}
                />
                <Typography variant="h3">
                  {authUser.displayName || authUser.email}
                </Typography>
                <div className=" py-1 px-2 rounded bg-cta text-dark-background">
                  <Typography variant="subtitle">
                    {userData.averagedAdvancedScore}
                  </Typography>
                </div>
              </div>
              <Typography>{userData.notes}</Typography>
            </div>
          </div>
        )}
        <div className=" mt-8 text-dark-text">
          <div className="flex space-x-4">
            <Typography variant="h3">Media</Typography>
            <button
              className={clsx(
                'hover:underline decoration-cta',
                activeMedia === 'videos' && 'underline',
              )}
              type="button"
              onClick={() => handleShallowRoute('videos')}
            >
              <Typography variant="subtitle">Videos</Typography>
            </button>
            <button
              className={clsx(
                'hover:underline decoration-cta',
                activeMedia === 'backdrops' && 'underline',
              )}
              type="button"
              onClick={() => handleShallowRoute('backdrops')}
            >
              <Typography variant="subtitle">Backdrops</Typography>
            </button>
            <button
              className={clsx(
                'hover:underline decoration-cta',
                activeMedia === 'posters' && 'underline',
              )}
              type="button"
              onClick={() => handleShallowRoute('posters')}
            >
              <Typography variant="subtitle">Posters</Typography>
            </button>
          </div>
          <div>
            {activeMedia === 'videos' && videos && (
              <div className="grid grid-rows-1 grid-flow-col overflow-scroll  gap-2 py-3">
                {videos.slice(0, 2).map((video) => (
                  <div
                    key={video.id}
                    className="h-[200px] md:h-[400px] relative w-full"
                  >
                    <iframe
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      className="rounded"
                      frameBorder="0"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      width="100%"
                    />
                  </div>
                ))}
              </div>
            )}
            {activeMedia === 'backdrops' && (
              <div className="grid grid-rows-1 grid-flow-col overflow-scroll  gap-2 py-3">
                {backdrops.slice(0, 2).map((backdrop) => (
                  <Link
                    key={backdrop.file_path}
                    passHref
                    href={`${imageUrl(100, false)}${backdrop.file_path}`}
                  >
                    <a>
                      <div className="h-[200px] md:h-[400px] relative w-full">
                        <Image
                          alt="backdrops"
                          className="rounded"
                          layout="fill"
                          objectFit="cover"
                          src={`${imageUrl(500, false)}${backdrop.file_path}`}
                        />
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            )}
            {activeMedia === 'posters' && (
              <div className="grid grid-rows-1 grid-flow-col overflow-scroll  gap-2">
                {posters.slice(0, 9).map((poster) => (
                  <Link
                    key={poster.file_path}
                    passHref
                    href={`${imageUrl(100, false)}${poster.file_path}`}
                  >
                    <a className="py-3" id={poster.file_path}>
                      <div className="h-40 md:h-[320px] md:w-[224px] relative w-28">
                        <Image
                          alt="poster"
                          className="rounded"
                          layout="fill"
                          objectFit="cover"
                          src={`${imageUrl(200)}${poster.file_path}`}
                        />
                      </div>
                    </a>
                  </Link>
                ))}
                <div className="flex  mt-3 items-center md:h-[320px] md:w-[224px] justify-center rounded text-dark-text h-40 relative w-28 bg-dark-components">
                  <Link passHref href="/">
                    <a className="hover:underline" id="View all Posters">
                      <Typography> View all Posters </Typography>
                    </a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        {similarTv && (
          <div className="mt-8 text-dark-text">
            <Typography variant="h3">Similar Movies</Typography>
            <div className="grid grid-rows-1 gap-2 grid-flow-col overflow-scroll py-3">
              {similarTv.results.map((value) => (
                <Poster key={value.id} media={value} />
              ))}
              <div className="flex items-center justify-center h-[320px] w-[192px] bg-dark-components rounded">
                <Link passHref href="/">
                  <a id="View more similar Movies">
                    <Typography>View more similar Movies</Typography>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="mt-8 space-y-3 p-4 h-screen text-dark-text bg-dark-components rounded overflow-scroll">
          <div>
            <Typography variant="h3">Status</Typography>
            <Typography>{details.status}</Typography>
          </div>
          <div>
            <Typography variant="h3">Release Date</Typography>
            <Typography>{details.first_air_date}</Typography>
          </div>
          <div>
            <Typography variant="h3">Original Language</Typography>
            <Typography>
              {ISO6391.getName(details.original_language)}
            </Typography>
          </div>
          {keywords && (
            <div>
              <Typography variant="h3">Keywords</Typography>
              <div className="flex flex-wrap">
                {/* TODO: Create Search page for keywords */}
                {keywords.map((keyword) => (
                  <Link key={keyword.id} passHref href="/">
                    <a id={keyword.name}>
                      <div className="border w-max hover:bg-white hover:bg-opacity-10 border-dark-text rounded p-1 m-1">
                        <Typography>{keyword.name}</Typography>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <MetaTags
        description={details.overview}
        image={`${imageUrl(300, false)}${details.poster_path}`}
        largeImage={`${imageUrl(300, false)}${details.backdrop_path}`}
        title={formatTitle(details.name, details.first_air_date)}
        url={router.asPath}
      />
      <Navigation />
      {renderCoverImage()}
      {renderMobileView()}
      {renderWebView()}
      <Modal open={movieReview} setOpen={setMovieReview}>
        <div>
          <Rating
            advanceScore={advancedScoring}
            closeModal={setMovieReview}
            defaultScore={userData?.advancedScore}
            defaultSimpleScore={userData?.simpleScore}
            media={details}
            refreshData={refreshData}
            setAdvanceScore={setAdvancedScoring}
          />
        </div>
      </Modal>
    </div>
  );
};

TVshow.getInitialProps = async (context) => {
  try {
    const { name } = context.query;

    if (!name || typeof name !== 'string') {
      throw new Error(`name broken: ${name}`);
    }

    const id = name.split('-')[0];

    const { res: tvDetails } = await getTVDetails(Number(id));
    const updatedTv = tvDetails?.data;

    if (updatedTv) updatedTv.media_type = 'tv';

    const { res: tvCastData } = await getTVCast(id);
    const { res: tvSimilar } = await getTVSimilar(id);
    tvSimilar?.data.results.forEach((tv) => {
      // eslint-disable-next-line no-param-reassign
      tv.media_type = 'tv';
    });
    const { res: tvKeywords } = await getTVKeywords(id);

    return {
      casts: tvCastData && tvCastData.data.cast,
      details: updatedTv || null,
      keywords: tvKeywords && tvKeywords.data.keywords,
      similarTv: tvSimilar && tvSimilar.data,
    };
  } catch (error) {
    Logger.error(error);

    return {
      casts: null,
      details: null,
      keywords: null,
      similarTv: null,
    };
  }
};

export default TVshow;

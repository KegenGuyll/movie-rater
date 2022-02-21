interface PersonDetails {
  birthday: string | null;
  known_for_department: string;
  deathday: null | string;
  id: number;
  name: string;
  also_known_as: string[];
  gender: 0 | 1 | 2 | 3;
  biography: string;
  popularity: number;
  place_of_birth: string | null;
  profile_path: string;
  adult: boolean;
  imdb_id: string;
  homepage: null | string;
}

interface PersonMovieCredits {
  cast: CastMovie[];
  crew: CrewMovie[];
}

interface PersonTVCredits {
  cast: CastTV[];
  crew: CrewTV[];
}

interface PersonCombinedCredits {
  cast: CastMovie[] | CastTV[];
  crew: CrewMovie[] | CrewTV[];
  id: number;
}

type CastMovie = {
  character: string,
  credit_id: string,
  release_date: string,
  vote_count: number,
  video: boolean,
  adult: boolean,
  vote_average: number,
  title: string,
  genre_ids: number[],
  original_language: string,
  original_title: string,
  popularity: number,
  id: number,
  backdrop_path: string | null,
  overview: string,
  poster_path: string | null,
  media_type: 'movie',
};

type CrewMovie = {
  job: string,
  department: string,
  credit_id: string,
  release_date: string,
  vote_count: number,
  video: boolean,
  adult: boolean,
  vote_average: number,
  title: string,
  genre_ids: number[],
  original_language: string,
  original_title: string,
  popularity: number,
  id: number,
  backdrop_path: string | null,
  overview: string,
  poster_path: string | null,
  media_type: 'movie',
};

type CastTV = {
  credit_id: string,
  original_name: string,
  id: number,
  genre_ids: number[],
  character: string,
  name: string,
  poster_path: string,
  vote_count: number,
  vote_average: number,
  popularity: number,
  episode_count: number,
  original_language: string,
  first_air_date: string,
  backdrop_path: string,
  overview: string,
  origin_country: string[],
  media_type: 'tv',
};

type CrewTV = {
  id: number,
  department: string,
  original_language: string,
  episode_count: number,
  job: string,
  overview: string,
  origin_country: string[],
  original_name: string,
  genre_ids: number[],
  name: string,
  first_air_date: string,
  backdrop_path: string,
  popularity: number,
  vote_count: number,
  vote_average: number,
  poster_path: string,
  credit_id: string,
  media_type: 'tv',
};

export type Cast = {
  title: string,
  credit_id: string,
  original_name: string,
  id: number,
  genre_ids: number[],
  character: string,
  name: string,
  poster_path: string,
  vote_count: number,
  vote_average: number,
  popularity: number,
  original_language: string,
  backdrop_path: string,
  overview: string,
  origin_country: string[],
  media_type: 'movie' | 'tv',
  release_date: string,
};

export type {
  PersonCombinedCredits,
  PersonDetails,
  PersonMovieCredits,
  PersonTVCredits,
};

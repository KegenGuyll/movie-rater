import MovieImages, { Backdrops, Poster } from './movieImages';
import MovieVideos, { Video } from './movieVideos';
import MultiSearch, { Person, TV } from './multiSearch';

interface Popular {
  page: number;
  results: Movie[];
}

interface Trending {
  page: number;
  results: Movie[];
}

type MediaType = 'all' | 'movie' | 'tv' | 'person';

type TimeWindow = 'day' | 'week';

type Cast = {
  adult: boolean,
  gender: number,
  id: number,
  known_for_department: string,
  name: string,
  original_name: string,
  popularity: number,
  profile_path?: string,
  cast_id: number,
  character: string,
  credit_id: string,
  order: number,
};

interface SearchSource {
  movie_results: Movie[];
  person_results: PopularPerson[];
  tv_results: [];
  tv_episode_results: [];
  tv_season_results: [];
}

interface MovieCast {
  id: number;
  cast: Cast[];
}

interface PopularPerson {
  adult: boolean;
  gender: number;
  id: number;
  known_for: KnownFor[];
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path?: string;
}

interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: BelongsToCollection;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  media_type: 'movie';
}
interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

interface KeywordsResponse {
  id: number;
  keywords: Keyword[];
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

type KnownFor = {
  backdrop_path: string,
  first_air_date?: Date,
  genre_ids: number[],
  id: number,
  media_type: string,
  name?: string,
  origin_country?: string[],
  original_language: string,
  original_name?: string,
  overview: string,
  poster_path: string,
  vote_average: number,
  vote_count: number,
  adult?: boolean,
  original_title?: string,
  release_date?: string,
  title?: string,
  video?: boolean,
};

type Movie = {
  poster_path: string | null,
  adult: boolean,
  overview: string,
  release_date: string,
  original_title: string,
  genre_ids: number[],
  id: number,
  media_type: 'movie',
  original_language: string,
  title: string,
  backdrop_path: string | null,
  popularity: number,
  vote_count: number,
  video: boolean,
  vote_average: number,
};

type Keyword = {
  id: number,
  name: string,
};

export type {
  Backdrops,
  Cast,
  Keyword,
  KeywordsResponse,
  KnownFor,
  MediaType,
  Movie,
  MovieCast,
  MovieDetails,
  MovieImages,
  MovieVideos,
  MultiSearch,
  Person,
  Popular,
  PopularPerson,
  Poster,
  SearchSource,
  TimeWindow,
  Trending,
  TV,
  Video,
};

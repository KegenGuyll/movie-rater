import { KnownFor } from './index';

interface MultiSearch {
  page: number;
  results: (Movie | TV | Person)[];
  total_results: number;
  total_pages: number;
}

export type Movie = {
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

export type TV = {
  poster_path: string | null,
  overview: string,
  release_date: string,
  original_title: string,
  genre_ids: number[],
  first_air_date: string,
  id: number,
  media_type: 'tv',
  original_language: string,
  title: string,
  backdrop_path: string | null,
  popularity: number,
  vote_count: number,
  video: boolean,
  vote_average: number,
  origin_country: string[],
  name: string,
};

export type Person = {
  profile_path: string,
  adult: boolean,
  id: number,
  media_type: 'person',
  known_for: KnownFor[],
  name: string,
  popularity: number,
};

export default MultiSearch;

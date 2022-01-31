import { AxiosResponse } from 'axios';

import { Movie } from '../../models/TMDB';
import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: {
    page: number,
    results: Movie[],
    total_results: number,
    total_pages: number,
  };
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getDiscoverMovie(): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1`,
  });
}

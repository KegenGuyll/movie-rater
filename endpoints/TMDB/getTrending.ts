import { AxiosResponse } from 'axios';
import { Trending, MediaType, TimeWindow } from '../../models/TMDB';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: Trending;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getTrendingMovies(
  mediaType: MediaType,
  timeWindow: TimeWindow,
  page = 1
): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?page=${page}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  });
}

import { AxiosResponse } from 'axios';
import { MovieCast } from '../../models/TMDB';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: MovieCast;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getMovieCast(
  movieId: string
): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  });
}

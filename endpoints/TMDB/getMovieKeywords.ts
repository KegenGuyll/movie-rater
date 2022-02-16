import { AxiosResponse } from 'axios';

import { KeywordsResponse } from '../../models/TMDB';
import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: KeywordsResponse;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getMovieKeywords(
  movieId: string
): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  });
}

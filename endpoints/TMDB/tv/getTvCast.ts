import { AxiosResponse } from 'axios';

import { MovieCast } from '../../../models/TMDB';
import resolve from '../../resolver';

interface IResponse extends AxiosResponse {
  data: MovieCast;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getTVCast(tvId: string): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  });
}

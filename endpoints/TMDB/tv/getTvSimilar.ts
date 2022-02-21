import { AxiosResponse } from 'axios';

import { TvSimilar } from '../../../models/TMDB/tv';
import resolve from '../../resolver';

interface IResponse extends AxiosResponse {
  data: TvSimilar;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getTVSimilar(tvId: string): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/tv/${tvId}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  });
}

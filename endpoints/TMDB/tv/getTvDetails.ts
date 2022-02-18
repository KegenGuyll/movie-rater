import { AxiosResponse } from 'axios';

import { TVDetails } from '../../../models/TMDB/tv';
import resolve from '../../resolver';

interface IResponse extends AxiosResponse {
  data: TVDetails;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getTVDetails(tvId: string): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/tv/${tvId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  });
}

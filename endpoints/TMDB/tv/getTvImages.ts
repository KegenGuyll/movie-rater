import { AxiosResponse } from 'axios';

import { MovieImages } from '../../../models/TMDB';
import resolve from '../../resolver';

interface IResponse extends AxiosResponse {
  data: MovieImages;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getTVImages(tvId: number): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/tv/${tvId}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  });
}

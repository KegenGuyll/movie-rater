import { AxiosResponse } from 'axios';

import { MovieDocument } from '../../models/firestore';
import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: MovieDocument[];
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getAllMovieReviews(
  tmdbID: number
): Promise<IResolvedPopular> {
  return resolve(
    {
      url: `/movie/all/${tmdbID}`,
    },
    true
  );
}

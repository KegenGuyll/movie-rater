import { AxiosResponse } from 'axios';

import { MovieDocument } from '../../models/firestore';
import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: MovieDocument;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function createReviewedMovie(
  data: any,
  authToken: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      data,
      headers: {
        Authorization: authToken,
      },
      method: 'POST',
      url: `/movie/`,
    },
    true
  );
}

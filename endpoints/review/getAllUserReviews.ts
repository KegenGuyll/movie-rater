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

export default function getAllUserReviews(
  authToken: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      headers: {
        Authorization: authToken,
      },
      url: `/movie/all`,
    },
    true
  );
}

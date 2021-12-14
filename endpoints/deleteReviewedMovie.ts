import { AxiosResponse } from 'axios';

import resolve from './resolver';

interface IResponse extends AxiosResponse {}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function deleteReviewedMovie(
  uuid: string,
  authToken: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      headers: {
        Authorization: authToken,
      },
      method: 'DELETE',
      url: `/movie/${uuid}`,
    },
    true
  );
}

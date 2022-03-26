import { AxiosResponse } from 'axios';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function addUserBackdrop(
  data: {
    backdropPath: string,
  },
  authToken: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      data,
      headers: {
        Authorization: authToken,
      },
      method: 'PUT',
      url: `/user/`,
    },
    true
  );
}

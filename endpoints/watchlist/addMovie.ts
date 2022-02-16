import { AxiosResponse } from 'axios';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: any;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function addMovie(
  data: number,
  authToken: string,
  listId: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      data: {
        id: data,
      },
      headers: {
        Authorization: authToken,
      },
      method: 'POST',
      url: `/watch-list/${listId}`,
    },
    true
  );
}

import { AxiosResponse } from 'axios';
import { AddMovie } from '../../models/watchlist';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: any;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function addMovie(
  data: AddMovie,
  authToken: string,
  listId: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      headers: {
        Authorization: authToken,
      },
      data,
      method: 'POST',
      url: `/watch-list/${listId}`,
    },
    true
  );
}

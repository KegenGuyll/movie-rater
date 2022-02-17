import { AxiosResponse } from 'axios';

import { CreateWatchList } from '../../models/watchlist';
import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: any;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function updateWatchList(
  data: CreateWatchList,
  authToken: string,
  id: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      data,
      headers: {
        Authorization: authToken,
      },
      method: 'PUT',
      url: `/watch-list/${id}`,
    },
    true
  );
}

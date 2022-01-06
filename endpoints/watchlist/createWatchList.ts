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

export default function createWatchList(
  data: CreateWatchList,
  authToken: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      headers: {
        Authorization: authToken,
      },
      data,
      method: 'POST',
      url: `/watch-list/`,
    },
    true
  );
}

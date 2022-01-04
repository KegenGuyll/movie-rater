import { AxiosResponse } from 'axios';
import { WatchList } from '../../models/watchlist';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: WatchList[];
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getAllWatchLists(
  authToken: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      headers: {
        Authorization: authToken,
      },
      url: `/watch-list`,
    },
    true
  );
}

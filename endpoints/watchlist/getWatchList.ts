import { AxiosResponse } from 'axios';

import { WatchList } from '../../models/watchlist';
import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: WatchList;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: any;
}

export default function getWatchList(
  watchListId: string,
  authToken?: string,
  user?: string
): Promise<IResolvedPopular> {
  const url = user
    ? `/watch-list/${watchListId}?user=${user}`
    : `/watch-list/${watchListId}`;

  return resolve(
    {
      headers: {
        Authorization: authToken || '',
      },
      url,
    },
    true
  );
}

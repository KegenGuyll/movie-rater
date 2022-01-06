import { AxiosResponse } from 'axios';
import { ExistMovie } from '../../models/watchlist';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: ExistMovie[];
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getMovieExist(
  authToken: string,
  imdbId: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      headers: {
        Authorization: authToken,
      },
      url: `/watch-list/check/${imdbId}`,
    },
    true
  );
}

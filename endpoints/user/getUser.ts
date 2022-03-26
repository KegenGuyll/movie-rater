import { AxiosResponse } from 'axios';

import { MovieDocument } from '../../models/firestore';
import { WatchList } from '../../models/watchlist';
import resolve from '../resolver';

export interface GetUserResponse {
  displayName: string;
  photoUrl: string;
  email: string;
  _id: string;
  uuid: string;
  reviews: MovieDocument[];
  watchLists: WatchList[];
  backdropPath?: string;
  profilePath?: string;
}

interface IResponse extends AxiosResponse {
  data: GetUserResponse;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getFullUser(uuid: string): Promise<IResolvedPopular> {
  return resolve(
    {
      method: 'GET',
      url: `/user/full/${uuid}`,
    },
    true
  );
}

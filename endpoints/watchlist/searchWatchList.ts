import { AxiosResponse } from 'axios';

import resolve from '../resolver';

export interface WatchListSearch {
  _id: string;
  description: string;
  title: string;
  movies: number[];
  tags: string[];
  score: number;
}

interface IResponse extends AxiosResponse {
  data: WatchListSearch[];
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function searchWatchList(
  query: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      url: `/watch-list/search?q=${query}`,
    },
    true
  );
}

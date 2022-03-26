import { AxiosResponse } from 'axios';

import resolve from '../resolver';

export interface GetUserTopMovies {
  _id: string;
  title: string;
  score: number;
  tmdbID: number;
  reviewedDate?: string;
  createdAt: {
    seconds: number,
    nanoseconds: number,
  };
  notes: string;
}

interface IResponse extends AxiosResponse {
  data: GetUserTopMovies[];
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getUserTopMovies(
  uuid: string,
  sort: '-1' | '1',
  limit?: number
): Promise<IResolvedPopular> {
  return resolve(
    {
      method: 'GET',
      url: `/user/topMovies/${uuid}?sort=${sort}&limit=${limit || 5}`,
    },
    true
  );
}

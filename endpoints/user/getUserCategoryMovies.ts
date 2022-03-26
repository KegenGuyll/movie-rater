import { AxiosResponse } from 'axios';

import resolve from '../resolver';

export interface GetUserCategory {
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

type Category =
  | 'acting'
  | 'characters'
  | 'cinematography'
  | 'climax'
  | 'ending'
  | 'music'
  | 'personalScore'
  | 'plot'
  | 'theme'
  | 'visuals';

interface IResponse extends AxiosResponse {
  data: GetUserCategory;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getUserCategoryMovies(
  category: Category,
  uuid: string,
  sort: '-1' | '1',
  limit?: number
): Promise<IResolvedPopular> {
  return resolve(
    {
      method: 'GET',
      url: `/user/${category}/${uuid}?sort=${sort}&limit=${limit || 5}`,
    },
    true
  );
}

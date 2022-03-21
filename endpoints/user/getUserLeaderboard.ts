import { AxiosResponse } from 'axios';

import resolve from '../resolver';

export type Position = {
  _id: string,
  reviews: number,
  email: string,
  uuid: string,
};

export interface Leaderboard {
  weekly: Position[];
  allTime: Position[];
}

interface IResponse extends AxiosResponse {
  data: {
    weekly: Position[],
    allTime: Position[],
  };
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getUserLeaderboard(): Promise<IResolvedPopular> {
  return resolve(
    {
      url: `/user/leaderboard`,
    },
    true
  );
}

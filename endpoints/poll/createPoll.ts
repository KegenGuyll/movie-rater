import { AxiosResponse } from 'axios';

import { MediaType } from '../../models/TMDB';
import { TimeStamp } from '../../models/watchlist';
import resolve from '../resolver';

export interface PollPayload {
  title: string;
  description: string;
  categories: Categories[];
}

export type Categories = {
  title: string;
  tmdbId: number;
  votes: string[];
  media_type: MediaType;
};

export interface PollResponse {
  _id: string
  title: string;
  description: string;
  categories: Categories[];
  creator: string
  createdAt: TimeStamp
  updatedAt: TimeStamp
  active: boolean
}

interface IResponse extends AxiosResponse {
  data: PollResponse
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function createPoll(
  data: PollPayload,
  authToken: string,
): Promise<IResolvedPopular> {
  return resolve(
    {
      data,
      headers: {
        Authorization: authToken,
      },
      method: 'POST',
      url: '/poll/',
    },
    true,
  );
}

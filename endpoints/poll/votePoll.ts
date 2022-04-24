import { AxiosResponse } from 'axios';

import resolve from '../resolver';
import { PollResponse } from './createPoll';

interface IResponse extends AxiosResponse {
  data: PollResponse
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function votePoll(
  id:string,
  authToken: string,
  category: string,
): Promise<IResolvedPopular> {
  return resolve(
    {
      headers: {
        Authorization: authToken,
      },
      method: 'POST',
      url: `/poll/vote/${id}?category=${category}`,
    },
    true,
  );
}

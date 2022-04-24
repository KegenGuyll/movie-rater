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

export default function getPoll(
  id: string,
): Promise<IResolvedPopular> {
  return resolve(
    {
      method: 'GET',
      url: `/poll/${id}`,
    },
    true,
  );
}

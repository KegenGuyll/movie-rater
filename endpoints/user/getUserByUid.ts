import { AxiosResponse } from 'axios';

import { User } from '../../models/user';
import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: User;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getUserByUid(uid: string): Promise<IResolvedPopular> {
  return resolve(
    {
      url: `/user/${uid}`,
    },
    true
  );
}

import { AxiosResponse } from 'axios';
import { RottenMovie } from '../models/rottenTomatoes';

import resolve from './resolver';

interface IResponse extends AxiosResponse {
  data: RottenMovie;
}

interface IResolvedMovie {
  res: IResponse | null;
  err: Error | null;
}

export default function getRottenMovie(
  type: string,
  uuid: string
): Promise<IResolvedMovie> {
  return resolve(
    {
      url: `/rotten/${type}/${uuid}`,
    },
    true
  );
}

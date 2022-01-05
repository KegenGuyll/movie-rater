import { AxiosResponse } from 'axios';
import { IMDBMovie } from '../../models/imdb/popular';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: IMDBMovie;
}

interface IResolvedMovie {
  res: IResponse | null;
  err: Error | null;
}

export default function getIMDBMovie(
  type: string,
  uuid: string
): Promise<IResolvedMovie> {
  return resolve(
    {
      url: `/imdb/${type}/${uuid}`,
    },
    true
  );
}

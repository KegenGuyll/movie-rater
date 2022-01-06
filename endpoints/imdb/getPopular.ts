import { AxiosResponse } from 'axios';
import { IMDBPopular } from '../../models/imdb/popular';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: IMDBPopular[];
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getIMDBPopular(): Promise<IResolvedPopular> {
  return resolve(
    {
      url: '/imdb/popular',
    },
    true
  );
}

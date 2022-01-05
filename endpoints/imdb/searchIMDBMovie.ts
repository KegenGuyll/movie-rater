import { AxiosResponse } from 'axios';
import { IMDBMovie } from '../../models/imdb/popular';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: IMDBMovie[];
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function searchIMDBMovie(
  search: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      url: `/imdb/search?search=${search}`,
    },
    true
  );
}

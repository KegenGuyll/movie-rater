import { AxiosResponse } from 'axios';
import { NumberSearch } from '../../models/pirate/index';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: NumberSearch[];
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function searchNumberMovie(
  search: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      url: `/123/search?search=${search}`,
    },
    true
  );
}

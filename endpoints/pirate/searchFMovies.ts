import { AxiosResponse } from 'axios';
import { FSearch } from '../../models/pirate/index';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: FSearch[];
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function searchFMovie(
  search: string
): Promise<IResolvedPopular> {
  return resolve(
    {
      url: `/f/search?search=${search}`,
    },
    true
  );
}

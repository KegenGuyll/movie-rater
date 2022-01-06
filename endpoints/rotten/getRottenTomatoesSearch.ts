import { AxiosResponse } from 'axios';
import { IMDBPopular } from '../../models/imdb/popular';
import { RottenTomatoesSearch } from '../../models/rottenTomatoes';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: RottenTomatoesSearch[];
}

interface IResolvedRottenTomatoesSearch {
  res: IResponse | null;
  err: Error | null;
}

export default function getRottenTomatoesSearch(
  search: string,
  type = 'm',
  year = ''
): Promise<IResolvedRottenTomatoesSearch> {
  return resolve(
    {
      url: `/rotten/search?search=${search}&type=${type}&year=${year}`,
    },
    true
  );
}

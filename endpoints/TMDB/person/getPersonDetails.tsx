import { AxiosResponse } from 'axios';

import { PersonDetails } from '../../../models/TMDB/person';
import resolve from '../../resolver';

interface IResponse extends AxiosResponse {
  data: PersonDetails;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getPersonDetails(
  personId: string
): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/person/${personId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  });
}

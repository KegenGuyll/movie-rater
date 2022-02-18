import { AxiosResponse } from 'axios';

import { PersonTVCredits } from '../../../models/TMDB/person';
import resolve from '../../resolver';

interface IResponse extends AxiosResponse {
  data: PersonTVCredits;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getPersonTVCredits(
  personId: string
): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/person/${personId}/tv_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  });
}

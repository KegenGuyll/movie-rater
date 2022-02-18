import { AxiosResponse } from 'axios';

import { PersonMovieCredits } from '../../../models/TMDB/person';
import resolve from '../../resolver';

interface IResponse extends AxiosResponse {
  data: PersonMovieCredits;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getPersonMovieCredits(
  personId: string
): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  });
}

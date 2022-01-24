import { AxiosResponse } from 'axios';
import { MovieDetails, SearchSource } from '../../models/TMDB';

import resolve from '../resolver';

interface IResponse extends AxiosResponse {
  data: SearchSource;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getFindExternalId(
  movieId: string,
  type:
    | 'imdb_id'
    | 'freebase_mid'
    | 'freebase_id'
    | 'tvdb_id'
    | 'tvrage_id'
    | 'facebook_id'
    | 'twitter_id'
    | 'instagram_id'
): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/find/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&external_source=${type}`,
  });
}

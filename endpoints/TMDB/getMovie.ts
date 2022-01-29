import { AxiosResponse } from "axios";

import { MovieDetails } from "../../models/TMDB";
import resolve from "../resolver";

interface IResponse extends AxiosResponse {
  data: MovieDetails;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getMovieDetails(
  movieId: string
): Promise<IResolvedPopular> {
  return resolve({
    url: `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  });
}

import { AxiosResponse } from "axios";

import { MultiSearch } from "../../models/TMDB";
import resolve from "../resolver";

interface IResponse extends AxiosResponse {
  data: MultiSearch;
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getMovieSearch(q: string): Promise<IResolvedPopular> {
  return resolve({
    url: `/api/TMDB/search/multi?q=${q}`,
  });
}

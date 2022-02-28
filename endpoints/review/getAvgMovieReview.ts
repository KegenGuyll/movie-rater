import { AxiosResponse } from 'axios';

import resolve from '../resolver';

export interface MovieScore {
  _id: {
    tmdbID: number,
    title: string,
  };
  totalScore: number;
  plot: number;
  theme: number;
  climax: number;
  ending: number;
  acting: number;
  characters: number;
  music: number;
  cinematography: number;
  visuals: number;
  personalScore: number;
}

interface IResponse extends AxiosResponse {
  data: MovieScore[];
}

interface IResolvedPopular {
  res: IResponse | null;
  err: Error | null;
}

export default function getAvgMovieReview(
  tmdbID: string | number
): Promise<IResolvedPopular> {
  return resolve(
    {
      url: `/movie/score/${tmdbID}`,
    },
    true
  );
}

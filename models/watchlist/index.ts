export interface WatchList {
  _id: string;
  title: string;
  description: string;
  public: boolean;
  movies: Movies[];
  created_at: TimeStamp;
  updated_at: TimeStamp;
}

type Movies = {
  rottenId: string;
  imdbId: string;
  title: string;
  poster: string;
  description: string;
  ratings: Rating[];
};

type Rating = {};

type TimeStamp = {
  _seconds: number;
  _nanoseconds: number;
};

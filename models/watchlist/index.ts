import { AdvancedScore } from '../firestore';

export interface WatchList {
  _id: string;
  title: string;
  description: string;
  public: boolean;
  movies: Movies[];
  created_at: TimeStamp;
  updated_at: TimeStamp;
}

export interface AddMovie {
  rottenId: string;
  imdbId: string | null;
  title: string;
  poster: string;
  description: string;
  rating: Rating;
  year: number;
}

type Movies = {
  rottenId: string;
  imdbId: string;
  title: string;
  poster: string;
  description: string;
  ratings: Rating[];
  year: number;
};

type Rating = {
  rotten: {
    audiencestate: string;
    tomatometerstate: string;
    tomatometerscore: string;
    audiencescore: string;
  };
  imdb: {
    score: string | null;
    metaScore: string | null;
  };
  personal: {
    advancedScore: AdvancedScore | null;
    simpleScore: number | null;
  };
};

type TimeStamp = {
  _seconds: number;
  _nanoseconds: number;
};

export interface ExistMovie {
  listTitle: string;
  listId: string;
  title: string;
  imdbId: string;
  rottenId: string;
  year: number;
}

export interface CreateWatchList {
  title: string;
  description: string;
  public: boolean;
}

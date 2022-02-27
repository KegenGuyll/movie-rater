interface WatchList {
  _id: string;
  title: string;
  description: string;
  public: boolean;
  movies: number[];
  created_at: TimeStamp;
  updated_at: TimeStamp;
  userId: string;
  tags: string[];
}

type AddMovie = number;

type Movies = {
  title: string,
  description: string,
  rating: Rating,
  year: number,
  tmdbID: number,
};

type Rating = {
  rotten?: {
    audiencestate: 'spilled' | 'upright' | '' | undefined,
    tomatometerstate: 'certified-fresh' | 'rotten' | 'fresh' | '' | undefined,
    tomatometerscore: string,
    audiencescore: string,
  },
  imdb?: {
    score: string | null,
    metaScore: string | null,
  },
  personal: {
    advancedScore: number | null,
    simpleScore: number | null,
  },
};

type TimeStamp = {
  _seconds: number,
  _nanoseconds: number,
};

interface ExistMovie {
  listTitle: string;
  listId: string;
  title: string;
  imdbId: string;
  rottenId: string;
  year: number;
}

interface CreateWatchList {
  title: string;
  description: string;
  public: boolean;
  userId: string;
  tags: string[];
}

export type {
  AddMovie,
  CreateWatchList,
  ExistMovie,
  Movies,
  Rating,
  TimeStamp,
  WatchList,
};

type RottenTomatoesSearch = {
  url: string;
  img: string;
  type: string;
  uuid: string;
  title: string;
  year: string;
};

export interface RottenMovie {
  audiencescore: string;
  rating: string;
  audiencestate: string;
  tomatometerstate: string;
  tomatometerscore: string;
  title: string;
  info: Info;
  movieSynopsis: string;
  poster: string;
  cast: Cast[];
  movieInfo: MovieInfo;
  whereToWatch: WhereToWatch[];
  photos: string[];
}

export interface Cast {
  name: string;
  character: string;
  img: string;
}

export interface Info {
  year: string;
  duration: string;
}

export interface MovieInfo {
  rating: string;
  genre: string[];
  'original-language': string;
  director: string;
  producer: string[];
  writer: string[];
  'release-date (theaters)': string;
  'release-date (streaming)': string;
  'box-office (gross usa)': string;
  runtime: string;
  distributor: string;
  'sound-mix': string;
  'aspect-ratio': string;
}

export interface WhereToWatch {
  provider: string;
  availability: string;
}

export type { RottenTomatoesSearch };

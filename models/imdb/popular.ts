export interface IMDBPopular {
  img: string;
  title: string;
  type: string;
  url: string;
  uuid: string;
  year: string;
}

export interface IMDBMovie {
  title: string;
  score: string;
  metaScore: string;
  rating: string;
  movieSynopsis: string;
  genre: string[];
  poster: string;
}

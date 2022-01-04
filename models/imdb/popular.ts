export interface IMDBPopular {
  img: string;
  title: string;
  type: string;
  url: string;
  uuid: string;
  year: string;
  titleMeter: 'positive' | 'negative';
  popularityChange: string;
}

export interface IMDBMovie {
  uuid: string;
  title: string;
  score: string;
  metaScore: string;
  rating: string;
  movieSynopsis: string;
  genre: string[];
  poster: string;
}

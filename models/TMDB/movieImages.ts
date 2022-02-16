interface MovieImages {
  id: number;
  backdrops: Backdrops[];
  posters: Poster[];
}

export type Backdrops = {
  aspect_ratio: number,
  file_path: string,
  height: number,
  iso_639_1?: string | null,
  vote_average: number,
  vote_count: number,
  width: number,
};

export type Poster = {
  aspect_ratio: number,
  file_path: string,
  height: number,
  iso_639_1?: string | null,
  vote_average: number,
  vote_count: number,
  width: number,
};

export default MovieImages;

import { Timestamp } from 'firebase/firestore';
import { IMDBMovie } from '../imdb/popular';
import { RottenMovie } from '../rottenTomatoes';

export interface MovieDocument {
  advancedScore: AdvancedScore | null;
  averagedAdvancedScore: number | null;
  createdAt: Timestamp;
  imdb: IMDBMovie | null;
  rotten: RottenMovie | null;
  simpleScore: number | null;
  title: string | null;
  unqiueid: string;
  updatedAt: Timestamp;
}

type AdvancedScore = {
  acting: number;
  characters: number;
  cinematography: number;
  climax: number;
  ending: number;
  music: number;
  personalScore: number;
  plot: number;
  theme: number;
  visuals: number;
};

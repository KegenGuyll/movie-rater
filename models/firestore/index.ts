import { Timestamp } from 'firebase/firestore';

export interface MovieDocument {
  _id: string;
  advancedScore: AdvancedScore | null;
  averagedAdvancedScore: number | null;
  createdAt: Timestamp;
  simpleScore?: number | null;
  title: string;
  release_date: string;
  updatedAt: Timestamp;
  notes?: string;
  tmdbID: number;
}

export type AdvancedScore = {
  acting: number,
  characters: number,
  cinematography: number,
  climax: number,
  ending: number,
  music: number,
  personalScore: number,
  plot: number,
  theme: number,
  visuals: number,
};

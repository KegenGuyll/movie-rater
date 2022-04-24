import dynamic from 'next/dynamic';
import React, { FunctionComponent } from 'react';

import { MovieScore } from '../../endpoints/review/getAvgMovieReview';
import Typography from '../typography';

const RadialBarChart = dynamic(
  () => import('../../components/charts/radialbarChart'),
  { ssr: false },
);

interface Props {
  score: MovieScore;
}

const DetailedScoreView: FunctionComponent<Props> = ({ score }: Props) => {
  if (!score) return null;

  return (
    <div className="flex flex-wrap space-x-4">
      <div className="flex flex-col items-center justify-center text-left">
        <div className="w-16 h-16 flex items-center justify-center bg-dark-components p-1 rounded-full">
          <RadialBarChart score={score.plot * 10} />
        </div>
        <Typography variant="subtitle">Plot</Typography>
      </div>
      <div className="flex flex-col items-center justify-center text-left">
        <div className="w-16 h-16 flex items-center justify-center bg-dark-components p-1 rounded-full">
          <RadialBarChart score={score.theme * 10} />
        </div>
        <Typography variant="subtitle">Theme</Typography>
      </div>
      <div className="flex flex-col items-center justify-center text-left">
        <div className="w-16 h-16 flex items-center justify-center bg-dark-components p-1 rounded-full">
          <RadialBarChart score={score.climax * 10} />
        </div>
        <Typography variant="subtitle">Climax</Typography>
      </div>
      <div className="flex flex-col items-center justify-center text-left">
        <div className="w-16 h-16 flex items-center justify-center bg-dark-components p-1 rounded-full">
          <RadialBarChart score={score.ending * 10} />
        </div>
        <Typography variant="subtitle">Ending</Typography>
      </div>
      <div className="flex flex-col items-center justify-center text-left">
        <div className="w-16 h-16 flex items-center justify-center bg-dark-components p-1 rounded-full">
          <RadialBarChart score={score.acting * 10} />
        </div>
        <Typography variant="subtitle">Acting</Typography>
      </div>
      <div className="flex flex-col items-center justify-center text-left">
        <div className="w-16 h-16 flex items-center justify-center bg-dark-components p-1 rounded-full">
          <RadialBarChart score={score.characters * 10} />
        </div>
        <Typography variant="subtitle">Characters</Typography>
      </div>
      <div className="flex flex-col items-center justify-center text-left">
        <div className="w-16 h-16 flex items-center justify-center bg-dark-components p-1 rounded-full">
          <RadialBarChart score={score.music * 10} />
        </div>
        <Typography variant="subtitle">Music</Typography>
      </div>
      <div className="flex flex-col items-center justify-center text-left">
        <div className="w-16 h-16 flex items-center justify-center bg-dark-components p-1 rounded-full">
          <RadialBarChart score={score.cinematography * 10} />
        </div>
        <Typography variant="subtitle">Cinematography</Typography>
      </div>
      <div className="flex flex-col items-center justify-center text-left">
        <div className="w-16 h-16 flex items-center justify-center bg-dark-components p-1 rounded-full">
          <RadialBarChart score={score.visuals * 10} />
        </div>
        <Typography variant="subtitle">Visuals</Typography>
      </div>
      <div className="flex flex-col items-center justify-center text-left">
        <div className="w-16 h-16 flex items-center justify-center bg-dark-components p-1 rounded-full">
          <RadialBarChart score={score.personalScore * 10} />
        </div>
        <Typography variant="subtitle">Personal Score</Typography>
      </div>
    </div>
  );
};

export default DetailedScoreView;

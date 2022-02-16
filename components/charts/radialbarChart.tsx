import { ArcElement, Chart } from 'chart.js';
import React, { FunctionComponent, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';

import Typography from '../typography';

interface Props {
  score: number;
}

const RadialBarChart: FunctionComponent<Props> = ({ score }) => {
  Chart.register(ArcElement);
  const options = {
    cutout: '85%',
    elements: {
      arc: {
        borderWidth: 1,
      },
    },
    responsive: true,
  };

  const data = useMemo(
    () => ({
      datasets: [
        {
          backgroundColor: ['#e82763', '#1c1c1c'],
          borderColor: ['#1c1c1c'],
          borderRadius: 2,
          data: [score, score - 100],
        },
      ],
    }),
    [score]
  );

  return (
    <div className="donut relative flex items-center w-full h-full">
      <Doughnut data={data} height="100%" options={options} width="100%" />
      <Typography
        className="absolute flex items-center right-0 left-0 mx-auto w-max"
        variant="h4"
      >
        {score / 10}
      </Typography>
    </div>
  );
};

export default RadialBarChart;

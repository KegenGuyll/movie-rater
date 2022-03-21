/* eslint-disable prettier/prettier */
import { Chart, registerables } from 'chart.js';
import React, { FunctionComponent, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

interface Props {
  allTimeScore: number;
}

const LeaderboardChart: FunctionComponent<Props> = ({ allTimeScore }) => {
  Chart.register(...registerables);
  const options = {
    barPercentage: 0.25,
    elements: {
      bar: {
        borderRadius: 10,
        borderWidth: 1,
      },
    },
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  };

  const data = useMemo(
    () => ({
      datasets: [
        {
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],
          barPercentage: 0.5,
          barThickness: 6,
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
          ],

          data: [10, 20, 30, 40, 50, 60, 70],
          label: 'My First Dataset',
          maxBarThickness: 8,
          minBarLength: 2,
        },
      ],
    }),
    [allTimeScore]
  );

  return (
    <div className="relative flex items-center w-full h-full">
      <Bar data={data} height="100%" options={options as any } width="100%" />
      {/* <Typography
        className="absolute flex items-center right-0 left-0 mx-auto w-max"
        variant="h4"
      >
        {allTimeScore}
      </Typography> */}
    </div>
  );
};

export default LeaderboardChart;

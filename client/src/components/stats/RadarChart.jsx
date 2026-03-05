import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const RadarChart = ({ stats = {} }) => {
  const { strength = 1, intelligence = 1, agility = 1 } = stats;

  const data = {
    labels: ['STR', 'INT', 'AGI'],
    datasets: [
      {
        label: 'Combat Stats',
        data: [strength, intelligence, agility],
        backgroundColor: 'rgba(0, 212, 255, 0.08)',
        borderColor: 'rgba(0, 212, 255, 0.6)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0, 212, 255, 1)',
        pointBorderColor: 'rgba(0, 212, 255, 0.3)',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0, 212, 255, 1)',
        pointRadius: 4,
        pointBorderWidth: 2,
      },
    ],
  };

  const maxStat = Math.max(strength, intelligence, agility, 10);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(67, 97, 238, 0.08)',
        },
        grid: {
          color: 'rgba(67, 97, 238, 0.08)',
        },
        pointLabels: {
          color: '#7a8ba8',
          font: { size: 11, family: 'Orbitron', weight: '500' },
        },
        ticks: {
          display: false,
          stepSize: Math.ceil(maxStat / 5),
        },
        suggestedMin: 0,
        suggestedMax: maxStat + 5,
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(5, 6, 15, 0.95)',
        titleColor: '#00d4ff',
        titleFont: { family: 'Orbitron', size: 10 },
        bodyColor: '#7a8ba8',
        bodyFont: { family: 'Rajdhani' },
        borderColor: 'rgba(67, 97, 238, 0.2)',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;

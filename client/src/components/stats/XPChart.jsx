import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const XPChart = ({ xpHistory = [] }) => {
  // If no history, show placeholder
  if (xpHistory.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-text-muted text-sm">
        No XP history yet. Complete quests to see your progress!
      </div>
    );
  }

  const labels = xpHistory.map((_, i) => `Day ${i + 1}`);
  const values = xpHistory.map((entry) => entry.xp || entry);

  const data = {
    labels,
    datasets: [
      {
        label: 'XP Earned',
        data: values,
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: 'rgba(139, 92, 246, 0.8)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#a0a0b8', font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#a0a0b8', font: { size: 10 } },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(17, 17, 27, 0.9)',
        titleColor: '#fff',
        bodyColor: '#a0a0b8',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="h-48">
      <Line data={data} options={options} />
    </div>
  );
};

export default XPChart;

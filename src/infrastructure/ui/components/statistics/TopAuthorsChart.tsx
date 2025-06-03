import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AuthorStats } from '../../../../domain/entities/Statistics';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopAuthorsChartProps {
  data: AuthorStats[];
}

const TopAuthorsChart: React.FC<TopAuthorsChartProps> = ({ data }) => {
  // Sort data by count (highest to lowest)
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  const chartData = {
    labels: sortedData.map(item => item.author),
    datasets: [
      {
        label: 'Books by author',
        data: sortedData.map(item => item.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false, // Hide legend to save space
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.x;
            return `${value} ${value === 1 ? 'book' : 'books'}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      }
    },
  };

  return (
    <div style={{ height: '280px', width: '100%', margin: '0', padding: '0' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TopAuthorsChart;

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { RatingDistributionChartProps } from './types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Component to display a rating distribution chart
 */
const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({ data, showLegend = true }) => {
  // Sort data by rating
  const sortedData = [...data].sort((a, b) => a.rating - b.rating);

  // Prepare data for the chart
  const chartData = {
    labels: sortedData.map(item => `${item.rating} ★`),
    datasets: [
      {
        label: 'Number of books',
        data: sortedData.map(item => item.count),
        backgroundColor: [
          'rgba(236, 72, 153, 0.6)',
          'rgba(219, 39, 119, 0.6)',
          'rgba(20, 184, 166, 0.6)',
          'rgba(13, 148, 136, 0.6)',
          'rgba(14, 116, 144, 0.6)',
        ],
        borderColor: [
          'rgb(236, 72, 153)',
          'rgb(219, 39, 119)',
          'rgb(20, 184, 166)',
          'rgb(13, 148, 136)',
          'rgb(14, 116, 144)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return `${value} ${value === 1 ? 'book' : 'books'}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ height: '270px' }} className="flex justify-center items-center">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default RatingDistributionChart;

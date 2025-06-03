import React from 'react';
import { Bar } from 'react-chartjs-2';
import { RatingStats } from '../../../../domain/entities/Statistics';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RatingDistributionChartProps {
  data: RatingStats[];
}

const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({ data }) => {
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
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
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
          label: function(context: any) {
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

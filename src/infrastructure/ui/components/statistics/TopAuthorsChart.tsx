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

// Registrar los componentes de ChartJS
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
  // Ordenar los datos por cantidad (de mayor a menor)
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  const chartData = {
    labels: sortedData.map(item => item.author),
    datasets: [
      {
        label: 'Libros por autor',
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
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.x;
            return `${value} ${value === 1 ? 'libro' : 'libros'}`;
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
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default TopAuthorsChart;

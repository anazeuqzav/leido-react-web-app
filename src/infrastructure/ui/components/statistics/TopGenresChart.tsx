import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { GenreStats } from '../../../../domain/entities/Statistics';

// Registrar los componentes de ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface TopGenresChartProps {
  data: GenreStats[];
}

const TopGenresChart: React.FC<TopGenresChartProps> = ({ data }) => {
  // Colores para el gráfico
  const backgroundColors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
  ];

  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

  const chartData = {
    labels: data.map(item => item.genre),
    datasets: [
      {
        label: 'Libros por género',
        data: data.map(item => item.count),
        backgroundColor: backgroundColors.slice(0, data.length),
        borderColor: borderColors.slice(0, data.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const label = context.label || '';
            return `${label}: ${value} ${value === 1 ? 'libro' : 'libros'}`;
          },
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default TopGenresChart;

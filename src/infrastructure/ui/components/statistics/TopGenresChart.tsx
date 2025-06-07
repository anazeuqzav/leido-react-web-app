import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { TopGenresChartProps } from './types';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

/**
 * Component to display a top genres chart
 */
const TopGenresChart: React.FC<TopGenresChartProps> = ({ data, maxItems = 5, showLegend = true }) => {
  const backgroundColors = [
    'rgba(20, 184, 166, 0.7)',  
    'rgba(79, 70, 229, 0.7)',   
    'rgba(139, 92, 246, 0.7)',  
    'rgba(236, 72, 153, 0.7)',  
    'rgba(245, 158, 11, 0.7)',  
    'rgba(239, 68, 68, 0.7)',   
    'rgba(16, 185, 129, 0.7)',  
    'rgba(59, 130, 246, 0.7)',  
  ];

  const borderColors = [
    'rgba(20, 184, 166, 1)',    
    'rgba(79, 70, 229, 1)',     
    'rgba(139, 92, 246, 1)',    
    'rgba(236, 72, 153, 1)',    
    'rgba(245, 158, 11, 1)',    
    'rgba(239, 68, 68, 1)',     
    'rgba(16, 185, 129, 1)',    
    'rgba(59, 130, 246, 1)',    
  ];

  const chartData = {
    labels: data.map(item => item.genre),
    datasets: [
      {
        label: 'Books by genre',
        data: data.map(item => item.count),
        backgroundColor: backgroundColors.slice(0, data.length),
        borderColor: borderColors.slice(0, data.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const label = context.label || '';
            return `${label}: ${value} ${value === 1 ? 'book' : 'books'}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%', margin: '0', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Pie data={chartData} options={options} style={{ maxWidth: '450px' }} />
    </div>
  );
};

export default TopGenresChart;

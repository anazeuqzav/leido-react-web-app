import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MonthlyReadStats } from '../../../../domain/entities/Statistics';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyReadChartProps {
  data: MonthlyReadStats[];
}

const MonthlyReadChart: React.FC<MonthlyReadChartProps> = ({ data }) => {
  // Format month names for display with month and year on separate lines
  const formatMonthLabel = (monthStr: string): string[] => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return [
      date.toLocaleDateString('en-US', { month: 'short' }),
      date.getFullYear().toString()
    ];
  };
  
  // Get current month and year to highlight the current month if present
  const currentDate = new Date();
  const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  // Sort data by date (from oldest to newest)
  const sortedData = [...data].sort((a, b) => a.month.localeCompare(b.month));

  const chartData = {
    labels: sortedData.map(item => formatMonthLabel(item.month)),
    datasets: [
      {
        label: 'Books read',
        data: sortedData.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: sortedData.map(item => 
          item.month === currentYearMonth 
            ? 'rgba(75, 192, 192, 1)' // Highlight current month
            : 'rgba(54, 162, 235, 1)'
        ),
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          usePointStyle: true,
          padding: 15
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: 'rgba(200, 200, 200, 0.75)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        cornerRadius: 4,
        callbacks: {
          title: (tooltipItems: any) => {
            // Get the original month-year data from the index
            const index = tooltipItems[0].dataIndex;
            const monthStr = sortedData[index].month;
            const [year, month] = monthStr.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          },
          label: (context: any) => {
            const value = context.parsed.y;
            return `${value} ${value === 1 ? 'book' : 'books'}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.15)',
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          font: {
            size: 10
          }
        }
      }
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 0,
        bottom: 0
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const
    }
  };

  return (
    <div style={{ height: '300px', width: '100%', margin: '0', padding: '0' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyReadChart;

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
import { MonthlyReadStats } from '../../../../domain/entities/Statistics';

// Registrar los componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyReadChartProps {
  data: MonthlyReadStats[];
}

const MonthlyReadChart: React.FC<MonthlyReadChartProps> = ({ data }) => {
  // Format month names for display
  const formatMonthLabel = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
        backgroundColor: sortedData.map(item => 
          item.month === currentYearMonth 
            ? 'rgba(75, 192, 192, 0.7)' // Highlight current month
            : 'rgba(54, 162, 235, 0.6)'
        ),
        borderColor: sortedData.map(item => 
          item.month === currentYearMonth 
            ? 'rgba(75, 192, 192, 1)' 
            : 'rgba(54, 162, 235, 1)'
        ),
        borderWidth: 1,
        borderRadius: 5,
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
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          title: (tooltipItems: any) => {
            return tooltipItems[0].label;
          },
          label: (context: any) => {
            const value = context.parsed.y;
            return `${value} ${value === 1 ? 'libro' : 'libros'}`;
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
            size: 11
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
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
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyReadChart;

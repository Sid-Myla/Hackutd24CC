// components/AnalyticsChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AnalyticsChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Income',
        data: [30000, 40000, 35000, 50000, 56000, 47000, 38000, 45000],
        borderColor: '#6a5acd',
        fill: false,
      },
      {
        label: 'Outcome',
        data: [20000, 30000, 25000, 40000, 46000, 37000, 28000, 35000],
        borderColor: '#ff4500',
        fill: false,
      },
    ],
  };

  return (
    <div className="analytics-chart">
      <h2>Analytics</h2>
      <Line data={data} />
    </div>
  );
}

export default AnalyticsChart;


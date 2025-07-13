// File: SellerSalesAnalytics.jsx
// Path: frontend/src/components/seller/SellerSalesAnalytics.jsx
// Purpose: Display seller's monthly sales analytics using Chart.js
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

// Components
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx';
import { theme } from '@/styles/theme';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SellerSalesAnalytics = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSalesHistory = async () => {
      try {
        const res = await axios.get('/api/seller/sales-history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const salesData = res.data;
        const labels = salesData.map((item) => item.month);
        const dataPoints = salesData.map((item) => item.carsSold);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Cars Sold',
              data: dataPoints,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching sales history:', err);
        setError('Failed to load sales data');
      } finally {
        setLoading(false);
      }
    };
    fetchSalesHistory();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Car Sales',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cars Sold',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">\ud83d\udcca Sales Analytics</h2>
        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}
        {!loading && !error && chartData && (
          <div className="bg-white shadow rounded-lg p-4">
            <Bar data={chartData} options={options} aria-label="Monthly car sales bar chart" />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SellerSalesAnalytics;

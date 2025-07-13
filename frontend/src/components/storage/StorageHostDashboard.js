// File: StorageHostDashboard.js
// Path: frontend/src/components/storage/StorageHostDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@components/common/Navbar';
import AdminLayout from '../admin/layout/AdminLayout';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const StorageHostDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/storage/host/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Error loading storage bookings:', err);
        setError('❌ Failed to fetch storage bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleComplete = async (bookingId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/storage/host/bookings/${bookingId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error('Error completing storage job:', err);
    }
  };

  return (
    <AdminLayout>
      <Navbar />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🏠 Storage Host Dashboard</h1>

        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}

        {!loading && !error && bookings.length === 0 && (
          <p className="text-gray-500">No storage assignments currently.</p>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((b) => (
              <Card key={b._id}>
                <p className="text-sm text-gray-600">Vehicle:</p>
                <p className="font-semibold">{b.car?.make} {b.car?.model} ({b.car?.year})</p>

                <p className="text-sm text-gray-600 mt-2">Requested By:</p>
                <p>{b.buyer?.email || 'Unknown'}</p>

                <p className="text-sm text-gray-600 mt-2">Storage Duration:</p>
                <p>{b.duration} days</p>

                <p className="text-sm text-gray-600 mt-2">Status:</p>
                <p>{b.status || 'Pending'}</p>

                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => handleComplete(b._id)}
                >
                  Mark as Stored
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default StorageHostDashboard;
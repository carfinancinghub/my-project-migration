// File: TitleTransferQueue.js
// Path: frontend/src/components/title/TitleTransferQueue.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const TitleTransferQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/title/transfers/pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQueue(res.data);
      } catch (err) {
        console.error('Error fetching title queue:', err);
        setError('❌ Failed to load title transfer queue');
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  const handleComplete = async (id) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/title/transfers/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQueue(queue.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to mark transfer complete:', err);
      alert('Error updating status');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚗 Title Transfer Queue</h1>
      {loading && <LoadingSpinner />}
      {error && <p className={theme.errorText}>{error}</p>}

      {!loading && !error && queue.length === 0 && (
        <p className="text-gray-500">No pending transfers found.</p>
      )}

      {!loading && !error && queue.length > 0 && (
        <ul className="space-y-4">
          {queue.map((item) => (
            <li key={item._id} className="border rounded p-4 shadow bg-white">
              <p><strong>Vehicle:</strong> {item.vin || item.vehicleId}</p>
              <p><strong>Buyer:</strong> {item.buyer?.email || 'N/A'}</p>
              <p><strong>Escrow ID:</strong> {item.escrowId}</p>
              <Button onClick={() => handleComplete(item._id)}>
                ✅ Mark Transfer Complete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TitleTransferQueue;

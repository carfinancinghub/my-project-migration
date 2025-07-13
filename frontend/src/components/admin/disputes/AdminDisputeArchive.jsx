// File: AdminDisputeArchive.js
// Path: frontend/src/components/admin/disputes/AdminDisputeArchive.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Card from '../../common/Card';
import Button from '../../common/Button';

const AdminDisputeArchive = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/disputes/archive`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setArchives(res.data);
      } catch (err) {
        console.error('Error fetching dispute archives:', err);
        setError('❌ Failed to load dispute archive');
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, []);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">🗃️ Dispute Archive & Resolution Records</h1>

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && archives.length === 0 && (
            <p className="text-gray-500">No archived disputes available.</p>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {archives.map((d) => (
                <Card key={d._id} className="hover:shadow-md flex justify-between items-start">
                  <div>
                    <p><strong>Dispute ID:</strong> {d._id}</p>
                    <p><strong>Parties:</strong> {d.buyer?.email || 'N/A'} vs {d.seller?.email || 'N/A'}</p>
                    <p><strong>Type:</strong> {d.type}</p>
                    <p><strong>Outcome:</strong> {d.outcome || 'N/A'}</p>
                    <p className="text-xs text-gray-500 mt-1">Resolved On: {new Date(d.resolvedAt).toLocaleDateString()}</p>
                  </div>
                  <Button onClick={() => {/* view details */}}>
                    View Details
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminDisputeArchive;

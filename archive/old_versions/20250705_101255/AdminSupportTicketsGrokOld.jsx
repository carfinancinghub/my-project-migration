// File: AdminSupportTickets.js
// Path: frontend/src/components/admin/support/AdminSupportTickets.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Button from '../../common/Button';
import Card from '../../common/Card';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/support/tickets`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTickets(res.data);
      } catch (err) {
        console.error('Error fetching support tickets:', err);
        setError('❌ Failed to load support tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">🆘 Support Tickets</h1>

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {!loading && !error && tickets.length === 0 && (
            <p className="text-gray-500">No support tickets.</p>
          )}

          {!loading && !error && tickets.length > 0 && (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <Card key={ticket._id} className="hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p><strong>Subject:</strong> {ticket.subject}</p>
                      <p className="text-sm text-gray-600"><strong>From:</strong> {ticket.user?.email || 'Unknown'}</p>
                      <p className="mt-2">{ticket.message}</p>
                      <p className="text-xs text-gray-500 mt-2"><strong>Status:</strong> {ticket.status}</p>
                    </div>
                    <div className="flex flex-col ml-4 space-y-2">
                      <Button onClick={() => {/* resolve logic */}} className="bg-green-600 hover:bg-green-700">
                        Resolve
                      </Button>
                      <Button onClick={() => {/* reject logic */}} className="bg-red-600 hover:bg-red-700">
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminSupportTickets;

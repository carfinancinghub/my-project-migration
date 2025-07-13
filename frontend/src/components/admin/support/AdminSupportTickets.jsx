// File: AdminSupportTickets.jsx
// Path: frontend/src/components/admin/support/AdminSupportTickets.jsx
// 👑 Cod1 Crown Certified — Admin Support Ticket Management Panel

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@/components/common/Card.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx';
import { toast } from '@/components/common/ToastManager.jsx';

// 🌟 Admin Support Tickets Component
const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const fetchSupportTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/admin/support/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching support tickets:', err);
      toast.error('Failed to fetch support tickets.');
      setError('Failed to fetch support tickets.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">
        {error}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Support Tickets</h1>
        {tickets.length === 0 ? (
          <p className="text-gray-600">No support tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket._id} title={`Ticket #${ticket._id}`}>
                <p><strong>User:</strong> {ticket.userEmail}</p>
                <p><strong>Issue:</strong> {ticket.issue}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AdminSupportTickets;

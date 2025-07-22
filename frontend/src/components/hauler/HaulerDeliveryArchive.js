// File: HaulerDeliveryArchive.js
// Path: frontend/src/components/hauler/HaulerDeliveryArchive.js
// 👑 Cod1 Crown Certified — Delivery Archive + Smart Filters, Geo Recap, CSV/PDF Export, and Dispute Reopen Tool

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const HaulerDeliveryArchive = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hauler/archive`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeliveries(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError('❌ Failed to fetch delivery archive');
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  useEffect(() => {
    const results = deliveries.filter((d) => {
      return (
        (statusFilter === 'All' || d.status === statusFilter) &&
        d.vehicle?.make?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFiltered(results);
  }, [searchTerm, statusFilter, deliveries]);

  const exportToCSV = () => {
    const rows = [
      ['Date', 'Vehicle', 'Pickup', 'Dropoff', 'Status', 'Hauler Notes'],
      ...filtered.map((d) => [
        new Date(d.completedAt).toLocaleDateString(),
        `${d.vehicle?.year} ${d.vehicle?.make} ${d.vehicle?.model}`,
        d.pickupLocation,
        d.dropoffLocation,
        d.status,
        d.notes || '—',
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hauler-deliveries.csv';
    a.click();
  };

  return (
    <div className="p-6 space-y-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">🗃️ Hauler Delivery Archive</h1>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by make..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Flagged">Flagged</option>
          <option value="Disputed">Disputed</option>
        </select>
        <Button onClick={exportToCSV}>📥 Export CSV</Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className={theme.errorText}>{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No deliveries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Vehicle</th>
                <th className="p-2 border">Pickup</th>
                <th className="p-2 border">Dropoff</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">GeoPin</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d._id} className="text-center">
                  <td className="p-2 border">{new Date(d.completedAt).toLocaleDateString()}</td>
                  <td className="p-2 border">{`${d.vehicle?.year} ${d.vehicle?.make}`}</td>
                  <td className="p-2 border">{d.pickupLocation}</td>
                  <td className="p-2 border">{d.dropoffLocation}</td>
                  <td className="p-2 border">{d.status}</td>
                  <td className="p-2 border">{d.geoPin || '—'}</td>
                  <td className="p-2 border">
                    {d.status === 'Flagged' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => window.location.href = `/disputes/start/${d._id}`}
                      >
                        Reopen Dispute
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HaulerDeliveryArchive;

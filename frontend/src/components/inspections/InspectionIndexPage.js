// File: InspectionIndexPage.js
// Path: frontend/src/components/inspections/InspectionIndexPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Button from '../../common/Button';
import Navbar from '../Navbar';

const InspectionIndexPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: '', email: '', tag: '', from: '', to: '' });
  const token = localStorage.getItem('token');

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/inspection/index`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setReports(res.data);
    } catch (err) {
      setError('❌ Failed to load inspection reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <ErrorBoundary>
      <Navbar />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🔍 Inspection Report Index</h1>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="email" type="text" placeholder="Search by email" value={filters.email} onChange={handleChange} className="border p-2 rounded" />
          <input name="tag" type="text" placeholder="Search by tag" value={filters.tag} onChange={handleChange} className="border p-2 rounded" />
          <select name="status" value={filters.status} onChange={handleChange} className="border p-2 rounded">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="complete">Complete</option>
            <option value="flagged">Flagged</option>
          </select>
          <input name="from" type="date" value={filters.from} onChange={handleChange} className="border p-2 rounded" />
          <input name="to" type="date" value={filters.to} onChange={handleChange} className="border p-2 rounded" />
          <Button type="submit">Apply Filters</Button>
        </form>

        {loading && <LoadingSpinner />}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && reports.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Vehicle</th>
                  <th className="p-2 border">Mechanic</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id}>
                    <td className="p-2 border">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 border">{r.vehicleMake} {r.vehicleModel} ({r.vehicleYear})</td>
                    <td className="p-2 border">{r.mechanic?.email || 'N/A'}</td>
                    <td className="p-2 border">{r.status}</td>
                    <td className="p-2 border">
                      <Link to={`/inspection/${r._id}`} className="text-blue-600 hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && reports.length === 0 && <p className="text-gray-500">No reports found for current filter.</p>}
      </div>
    </ErrorBoundary>
  );
};

export default InspectionIndexPage;

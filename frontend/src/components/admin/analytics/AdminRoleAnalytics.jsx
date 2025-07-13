// File: AdminRoleAnalytics.js
// Path: frontend/src/components/AdminRoleAnalytics.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AdminRoleAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/role-analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching role analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">📊 Admin Role Activity Analytics</h2>
        {loading ? (
          <p>Loading role data...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdminRoleAnalytics;

// File: AdminUserManager.js
// Path: frontend/src/components/admin/user/AdminUserManager.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to load users', err);
        setError('❌ Unable to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handlePromoteToJudge = async (userId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/promote-judge/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.map((user) => user._id === userId ? { ...user, judge: true } : user));
    } catch (err) {
      console.error('Failed to promote user to judge', err);
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/suspend-user/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.map((user) => user._id === userId ? { ...user, suspended: true } : user));
    } catch (err) {
      console.error('Failed to suspend user', err);
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Admin User Management</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Verified</th>
                <th className="p-3 border">Judge</th>
                <th className="p-3 border">Reputation</th>
                <th className="p-3 border">Suspended</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border capitalize">{user.role}</td>
                  <td className="p-3 border">{user.verified ? '✅' : '⏳'}</td>
                  <td className="p-3 border">{user.judge ? '⚖️ Judge' : 'No'}</td>
                  <td className="p-3 border">{user.reputationScore || 0}</td>
                  <td className="p-3 border">{user.suspended ? '🚫' : 'Active'}</td>
                  <td className="p-3 border space-x-2">
                    {!user.judge && (
                      <Button onClick={() => handlePromoteToJudge(user._id)} size="sm">
                        Promote to Judge
                      </Button>
                    )}
                    {!user.suspended && (
                      <Button onClick={() => handleSuspendUser(user._id)} size="sm" variant="destructive">
                        Suspend
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManager;

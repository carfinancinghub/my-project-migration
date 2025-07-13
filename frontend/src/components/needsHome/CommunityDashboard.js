import React, { useState, useEffect } from 'react';
import UserReviewList from './UserReviewList';
import './CommunityDashboard.css';

const CommunityDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError('Failed to load community data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="community-dashboard p-6">
      <h2 className="text-2xl font-bold mb-4">Community Dashboard</h2>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Rating</th>
                <th className="border px-4 py-2">Badge Count</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">{user.ratings || 'N/A'}</td>
                  <td className="border px-4 py-2">{user.badgeCount || 0}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedUserId(user._id)}
                    >
                      View Reviews
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedUserId && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">User Reviews</h3>
              <UserReviewList userId={selectedUserId} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityDashboard;
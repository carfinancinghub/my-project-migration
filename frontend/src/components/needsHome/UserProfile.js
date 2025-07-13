// File: UserProfile.js
// Path: frontend/src/components/UserProfile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import useAuth from './useAuth';
import BadgeDisplay from './BadgeDisplay';

const UserProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    bio: '',
    reputationLevel: 'Bronze'
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        reputationLevel: user.reputationLevel || 'Bronze'
      });
    }
  }, [user]);

  const calculateCompletion = () => {
    let fields = [formData.username, formData.email, formData.phone, formData.bio];
    let filled = fields.filter((val) => val && val.trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Profile updated');
    } catch (err) {
      setMessage('❌ Failed to update profile');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">User Profile</h1>

        <div className="flex justify-between items-center mb-3">
          <BadgeDisplay level={formData.reputationLevel} />
          <div className="text-sm text-gray-600">
            Profile Completion: {calculateCompletion()}%
          </div>
        </div>

        {message && <p className="mb-4 text-sm text-red-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Short Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full p-2 border rounded h-24"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

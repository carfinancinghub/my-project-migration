// File: Register.js
// Path: frontend/src/components/auth/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      setMessage('✅ Registration successful');
    } catch (err) {
      setMessage('❌ Registration failed');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {message && <p className="mb-4 text-sm text-red-600">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
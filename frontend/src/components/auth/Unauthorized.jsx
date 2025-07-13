// File: Unauthorized.js
// Path: frontend/src/components/auth/Unauthorized.js

import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Access Denied</h1>
      <p className="text-gray-700 text-lg mb-6">
        You do not have permission to access this page.
      </p>
      <Button onClick={() => navigate('/')}>Go to Home</Button>
    </div>
  );
};

export default Unauthorized;

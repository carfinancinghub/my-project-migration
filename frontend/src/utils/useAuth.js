// File: useAuth.js
// Path: frontend/src/utils/useAuth.js

import { useEffect, useState } from 'react';

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
  }, []);

  return { token, role };
};

export default useAuth;

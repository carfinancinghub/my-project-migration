// File: EscrowOfficerHook.js
// Path: frontend/src/components/escrow/EscrowOfficerHook.js
// Purpose: Custom hook for fetching and managing escrow transactions
// Author: Cod2 Crown Certified (05072155)

import { useState, useEffect } from 'react';
import axios from 'axios';

const useEscrowTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/escrow`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching escrow transactions:', err);
        setError('Failed to load escrow transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { transactions, loading, error };
};

export default useEscrowTransactions;

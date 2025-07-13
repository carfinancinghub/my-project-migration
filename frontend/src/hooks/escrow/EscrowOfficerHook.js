// File: EscrowOfficerHook.js
// Path: frontend/src/hooks/escrow/EscrowOfficerHook.js
// Author: Cod2 (05072100)
// Description: Reusable hook to fetch and update escrow transactions

import { useEffect, useState } from 'react';
import axios from 'axios';

const useEscrowTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/escrow-transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  return { transactions, loading, error, refresh: fetchTransactions };
};

export default useEscrowTransactions;

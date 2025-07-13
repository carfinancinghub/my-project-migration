// frontend/src/components/lender/LenderTermsHistoryViewer.jsx
import React, { useState, useEffect } from 'react';

const LenderTermsHistoryViewer = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/lender/terms-history/${userId}?limit=10&sort=desc`);
        const result = await response.json();
        if (result.success) {
          setHistory(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch terms history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="lender-terms-history">
      <h3>Terms History</h3>
      {history.length === 0 ? (
        <p>No terms history available.</p>
      ) : (
        <ul>
          {history.map((term, index) => (
            <li key={index}>
              Loan: ${term.loanAmount} at {term.interestRate}% for {term.durationMonths} months
              {term.createdAt && <span> (Created: {term.createdAt})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LenderTermsHistoryViewer;
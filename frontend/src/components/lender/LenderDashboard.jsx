/**
 * File: LenderDashboard.jsx
 * Path: frontend/src/components/lender/LenderDashboard.jsx
 * Purpose: Primary Lender dashboard for managing loan applications with AI match scores and countdown timers
 * Author: Rivers Auction Team
 * Date: April 19, 2025
 * Updated: Added SEOHead for SEO optimization, updated imports to use @ alias
 * 👑 Crown Certified
 * Features:
 * - Displays loan applications with applicant, status, amount, AI match score, and time remaining
 * - Countdown timer with urgency indicator for review deadlines
 * - Search functionality to filter loans by applicant, ID, or amount
 * - Navigation links to specialized Lender dashboards (Analytics, Loyalty, Pre-Approval, Review)
 * - Responsive layout with TailwindCSS
 * - SEO optimization with SEOHead
 * Functions:
 * - fetchLoans(): Fetches loans from /api/loans
 * - handleSearch(): Filters loans by applicant, ID, or amount
 * - getTimeRemaining(endTime): Calculates time remaining for review deadlines
 * Dependencies: useNavigate, AdminLayout, Navbar, Card, Button, Input, LoadingSpinner, theme, SEOHead
 */

// Imports
import React\nimport SEOHead from '@components/common/SEOHead';, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import Navbar from '@/components/layout/Navbar';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { theme } from '@/styles/theme';
import SEOHead from '@/components/common/SEOHead';

const LenderDashboard = () => {
  // State Management
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch Loans on Component Mount
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/loans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoans(res.data);
        setFilteredLoans(res.data);
      } catch (err) {
        setError('Failed to load loan data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [token]);

  // Handle Search for Loans
  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearchQuery(val);
    const filtered = loans.filter(loan =>
      loan.applicant?.toLowerCase().includes(val) ||
      loan._id?.toLowerCase().includes(val) ||
      (loan.amount + '').includes(val)
    );
    setFilteredLoans(filtered);
  };

  // Calculate Time Remaining for Review Deadlines
  const getTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.now();
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return { total, minutes, seconds };
  };

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Lender Dashboard - CFH Auction Platform" />
      <SEOHead title="Lender Dashboard - CFH Auction Platform" />
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold" aria-label="Lender Dashboard">📈 Lender Dashboard</h1>
          <div className="flex gap-2">
            <Link to="/lender/analytics" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" aria-label="Navigate to Lender Analytics">
              Analytics
            </Link>
            <Link to="/lender/loyalty" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded" aria-label="Navigate to Lender Loyalty">
              Loyalty
            </Link>
            <Link to="/lender/preapproval" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" aria-label="Navigate to Lender Pre-Approval">
              Pre-Approval
            </Link>
            <Link to="/lender/review" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded" aria-label="Navigate to Lender Review">
              Contract Review
            </Link>
          </div>
        </div>

        <Input
          type="text"
          placeholder="Search by applicant, ID, or amount..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/2"
          aria-label="Search loans by applicant, ID, or amount"
        />

        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText} role="alert" aria-live="assertive">{error}</p>}

        {!loading && filteredLoans.length === 0 && (
          <p className="text-gray-500">No loan applications found.</p>
        )}

        {!loading && filteredLoans.length > 0 && (
          <div className="grid gap-4">
            {filteredLoans.map((loan) => {
              const { total, minutes, seconds } = getTimeRemaining(loan.reviewDeadline);
              const urgent = total <= 600000; // under 10 min

              return (
                <Card key={loan._id} className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold">Applicant: {loan.applicant}</h2>
                  <p>Status: <span className="text-blue-700 font-medium">{loan.status}</span></p>
                  <p>Amount: ${loan.amount.toLocaleString()}</p>

                  {loan.matchScore && (
                    <p className="text-green-600 font-semibold">
                      🤖 Match Score: {loan.matchScore}%
                    </p>
                  )}

                  {loan.reviewDeadline && (
                    <p className={urgent ? 'text-red-600' : 'text-gray-700'}>
                      ⏱ Time Remaining: {minutes}m {seconds}s
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button onClick={() => alert(`Exporting loan ${loan._id}`)} variant="outline" aria-label={`Export loan ${loan._id} as PDF`}>📄 Export PDF</Button>
                    <Button onClick={() => alert(`Viewing audit for ${loan._id}`)} variant="secondary" aria-label={`View audit for loan ${loan._id}`}>🔍 View Audit</Button>
                    <Button onClick={() => alert(`Bid on loan ${loan._id}`)} aria-label={`Place bid on loan ${loan._id}`}>🌎 Place Bid</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default LenderDashboard;

/**
 * SellerMilestoneCelebrator.jsx
 * Path: frontend/src/components/seller/SellerMilestoneCelebrator.jsx
 * Purpose: Celebrate seller milestones with animated popups and confetti effect.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SellerMilestoneCelebrator = () => {
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/seller/milestones', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMilestones(response.data);
        setIsLoading(false);
        // Show the most recent unviewed milestone
        const unviewed = response.data.find((m) => !m.viewed);
        if (unviewed) setShowPopup(unviewed);
      } catch (err) {
        setError('Failed to load milestones');
        setIsLoading(false);
        toast.error('Error loading milestones');
      }
    };
    fetchMilestones();
  }, []);

  const handleShare = (milestone) => {
    const shareText = `I just achieved ${milestone.name} on the platform! 🎉`;
    if (navigator.share) {
      navigator.share({
        title: 'My Seller Milestone',
        text: shareText,
        url: window.location.href,
      }).catch(() => toast.error('Failed to share milestone'));
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Milestone copied to clipboard!');
    }
    setShowPopup(null);
  };

  const closePopup = () => {
    setShowPopup(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Milestones</h1>
        {milestones.length === 0 ? (
          <div className="text-center py-12">
            <img
              src="/empty-milestones.svg"
              alt="No milestones"
              className="mx-auto h-32 w-32 mb-4 opacity-50"
            />
            <p className="text-gray-500 text-lg">No milestones yet. Keep selling to earn some! 🎉</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
                aria-label={`Milestone: ${milestone.name}`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl">{milestone.icon || '🏆'}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{milestone.name}</h3>
                    <p className="text-gray-600 text-sm">{milestone.description}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Achieved: {new Date(milestone.achievedDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full text-center animate-popIn relative">
              <div className="confetti absolute inset-0 pointer-events-none"></div>
              <span className="text-5xl mb-4 block">{showPopup.icon || '🎉'}</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Congratulations!</h2>
              <p className="text-gray-600 mb-4">You achieved: <strong>{showPopup.name}</strong></p>
              <p className="text-gray-600 mb-6">{showPopup.description}</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleShare(showPopup)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  aria-label={`Share milestone ${showPopup.name}`}
                >
                  Share Success
                </button>
                <button
                  onClick={closePopup}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  aria-label="Close milestone popup"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .animate-popIn {
            animation: popIn 0.3s ease-out forwards;
          }
          .confetti {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="5" height="10" fill="%23ff5555" /><rect x="10" width="5" height="10" fill="%2355ff55" /><rect x="5" y="10" width="5" height="10" fill="%235555ff" /></svg>') repeat;
            animation: confettiFall 5s linear infinite;
          }
          @keyframes confettiFall {
            from { background-position: 0 0; }
            to { background-position: 0 100px; }
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default SellerMilestoneCelebrator;
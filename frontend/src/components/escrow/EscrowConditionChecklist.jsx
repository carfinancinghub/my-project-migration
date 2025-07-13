/**
 * EscrowConditionChecklist.jsx
 * Path: frontend/src/components/escrow/EscrowConditionChecklist.jsx
 * Purpose: Allow escrow officers to check off conditions (e.g., title received, lien cleared) for a transaction.
 * 👑 Crown Pyramid Escrow System
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const EscrowConditionChecklist = ({ conditions, escrowId }) => {
  const [localConditions, setLocalConditions] = useState(conditions);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleCondition = (index) => {
    setLocalConditions((prev) =>
      prev.map((condition, i) =>
        i === index ? { ...condition, met: !condition.met } : condition
      )
    );
  };

  const handleSaveConditions = async () => {
    setIsSaving(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to save conditions');
      setIsSaving(false);
      toast.error('Authentication required');
      return;
    }

    try {
      await axios.post(
        `/api/escrow/${escrowId}/update-conditions`,
        { conditions: localConditions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Conditions saved successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save conditions';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Escrow Conditions Checklist
        </h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {localConditions.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No conditions to display
            </div>
          ) : (
            <ul className="space-y-4">
              {localConditions.map((condition, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 animate-fadeIn"
                >
                  <input
                    type="checkbox"
                    checked={condition.met}
                    onChange={() => handleToggleCondition(index)}
                    className={`w-5 h-5 rounded ${
                      condition.met
                        ? 'bg-green-500 border-green-500'
                        : 'bg-gray-200 border-gray-300'
                    } cursor-pointer`}
                    disabled={isSaving}
                    aria-label={`Mark ${condition.description} as ${
                      condition.met ? 'incomplete' : 'complete'
                    }`}
                  />
                  <span
                    className={`text-gray-700 ${
                      condition.met ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {condition.description}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
          {localConditions.length > 0 && (
            <button
              onClick={handleSaveConditions}
              className={`mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Conditions'}
            </button>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

EscrowConditionChecklist.propTypes = {
  conditions: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      met: PropTypes.bool.isRequired,
    })
  ).isRequired,
  escrowId: PropTypes.string.isRequired,
};

export default EscrowConditionChecklist;
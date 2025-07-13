/**
 * File: SupportDashboard.jsx
 * Path: frontend/src/components/support/SupportDashboard.jsx
 * Purpose: Admin-facing dashboard to manage support tickets with smart filters and escalation tools
 * Author: Cod1 (05111431)
 * Date: May 26, 2025
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays support tickets with filtering by status (all, open, resolved, priority)
 * - Premium features: agent performance metrics, AI escalation suggestions, and quick actions (resolve/escalate)
 * - Responsive layout with TailwindCSS and error handling
 * Functions:
 * - fetchAgentMetrics(): Fetches performance stats via getAgentMetrics
 * - fetchEscalationSuggestions(): Fetches AI escalation suggestions for tickets via getEscalationSuggestion
 * - handleAction(ticketId, action): Executes quick actions (resolve, escalate) via triggerSupportAction
 * Dependencies: logger, getAgentMetrics, getEscalationSuggestion, triggerSupportAction, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getAgentMetrics } from '@services/metrics/SupportAgentAnalytics';
import { getEscalationSuggestion } from '@services/ai/TicketClassifier';
import { triggerSupportAction } from '@services/storage/SupportActionEngine';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

const SupportDashboard = ({ tickets, isPremium }) => {
  // State Management
  const [filter, setFilter] = useState('all');
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [escalations, setEscalations] = useState({});

  // Fetch Metrics and Escalation Suggestions on Component Mount or Tickets/IsPremium Change
  useEffect(() => {
    if (!isPremium) return;
    getAgentMetrics()
      .then(setMetrics)
      .catch((err) => {
        logger.error('Metrics fetch failed:', err);
        setError('Metrics unavailable.');
      });

    tickets.forEach((ticket) => {
      getEscalationSuggestion(ticket.description)
        .then((suggestion) =>
          setEscalations((prev) => ({ ...prev, [ticket.id]: suggestion }))
        )
        .catch((err) =>
          logger.error('Escalation suggestion failed for ticket ' + ticket.id, err)
        );
    });
  }, [tickets, isPremium]);

  // Filter Tickets Based on Selected Filter
  const filtered = tickets.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'priority') return t.priority;
    if (filter === 'open') return t.status === 'Open';
    if (filter === 'resolved') return t.status === 'Resolved';
    return true;
  });

  // Handle Support Action (Resolve or Escalate)
  const handleAction = (ticketId, action) => {
    try {
      triggerSupportAction(ticketId, action);
    } catch (err) {
      logger.error('Support action failed:', err);
    }
  };

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Support Dashboard - CFH Auction Platform" />
      <div className={`bg-white ${theme.borderRadius} ${theme.cardShadow} ${theme.spacingMd}`}>
        <h2 className="text-xl font-bold mb-4">Support Dashboard</h2>
        <div className="mb-4">
          {['all', 'open', 'resolved', 'priority'].map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`${theme.primaryButton} mr-2 px-4 py-2`}
              aria-label={`Filter tickets by ${key}`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        {isPremium && metrics && (
          <div className="mb-4">
            Agent Metrics: Avg Res Time: {metrics.avgTime} | Escalations: {metrics.escalationRate}%
          </div>
        )}
        {error && <div className={`${theme.errorText} mb-4`}>{error}</div>}
        <ul className="space-y-4">
          {filtered.map((t) => (
            <li key={t.id} className="border-b pb-2">
              <div>ID: {t.id}</div>
              <div>Status: {t.status}</div>
              <div>Description: {t.description}</div>
              {t.priority && <div className="text-red-600">Priority Boosted</div>}
              {isPremium && escalations[t.id] && (
                <div>AI Suggestion: {escalations[t.id]}</div>
              )}
              {isPremium && (
                <div className="mt-2">
                  <button
                    onClick={() => handleAction(t.id, 'resolve')}
                    className={`${theme.successText} bg-green-600 hover:bg-green-700 px-4 py-1 ${theme.borderRadius} mr-2`}
                    aria-label={`Resolve ticket ${t.id}`}
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleAction(t.id, 'escalate')}
                    className={`${theme.warningText} bg-yellow-600 hover:bg-yellow-700 px-4 py-1 ${theme.borderRadius}`}
                    aria-label={`Escalate ticket ${t.id}`}
                  >
                    Escalate
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
};

// Prop Type Validation
SupportDashboard.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      priority: PropTypes.bool,
    })
  ).isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default SupportDashboard;
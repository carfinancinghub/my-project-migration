// File: SupportDashboard.jsx
// Path: frontend/src/components/support/SupportDashboard.jsx
// Purpose: Admin-facing dashboard to manage support tickets with smart filters and escalation tools
// Author: Cod1 (05111431 - PDT)
// 👑 Cod2 Crown Certified

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import logger from '@utils/logger';
import { getAgentMetrics } from '@services/metrics/SupportAgentAnalytics';
import { getEscalationSuggestion } from '@services/ai/TicketClassifier';
import { triggerSupportAction } from '@services/storage/SupportActionEngine';

/**
 * Functions Summary:
 * - getAgentMetrics(): Fetches performance stats
 * - getEscalationSuggestion(): Recommends escalation
 * - triggerSupportAction(): Executes quick action (e.g., escalate, refund)
 * Inputs: ticket list, isPremium
 * Outputs: Filtered UI, metrics, escalation suggestions
 * Dependencies: logger, @services/*
 */
const SupportDashboard = ({ tickets, isPremium }) => {
  const [filter, setFilter] = useState('all');
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [escalations, setEscalations] = useState({});

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

  const filtered = tickets.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'priority') return t.priority;
    if (filter === 'open') return t.status === 'Open';
    if (filter === 'resolved') return t.status === 'Resolved';
    return true;
  });

  const handleAction = (ticketId, action) => {
    try {
      triggerSupportAction(ticketId, action);
    } catch (err) {
      logger.error('Support action failed:', err);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Support Dashboard</h2>
      <div className="mb-4">
        {['all', 'open', 'resolved', 'priority'].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="mr-2 px-4 py-2 bg-blue-600 text-white rounded"
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
      {error && <div className="text-red-600 mb-4">{error}</div>}
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
                  className="mr-2 px-4 py-1 bg-green-600 text-white rounded"
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleAction(t.id, 'escalate')}
                  className="px-4 py-1 bg-yellow-600 text-white rounded"
                >
                  Escalate
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

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
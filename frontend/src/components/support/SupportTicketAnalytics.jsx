// File: SupportTicketAnalytics.jsx
// Path: C:\CFH\frontend\src\components\support\SupportTicketAnalytics.jsx
// Purpose: Analytics dashboard
// Author: Rivers Auction Dev Team
// Date: 2025-05-23
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/support

import React, { useState, useEffect, useCallback } from 'react';
import logger from '@utils/logger';
import SupportApiService from '@services/api/support';

interface AnalyticsProps {
  userId: string;
  isPremium: boolean;
}

const SupportTicketAnalytics: React.FC<AnalyticsProps> = ({ userId, isPremium }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatbotActive, setIsChatbotActive] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    logger.info(`[SupportTicketAnalytics] Fetching analytics for userId: ${userId}`);
    try {
      const data = await SupportApiService.getTicketAnalytics(userId);
      setAnalyticsData(data);
      logger.info(`[SupportTicketAnalytics] Successfully fetched analytics for userId: ${userId}`);
    } catch (err) {
      logger.error(`[SupportTicketAnalytics] Failed to load analytics for userId ${userId}: ${err.message}`, err);
      setError('Failed to load analytics data. Please try again later.');
      setAnalyticsData(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportPDF = () => {
    logger.info(`[SupportTicketAnalytics] PDF export initiated by userId: ${userId}`);
    alert('PDF Export functionality would be triggered here.');
    SupportApiService.exportAnalytics(userId, 'pdf')
      .then(() => logger.info(`[SupportTicketAnalytics] PDF export successful for userId: ${userId}`))
      .catch(err => logger.error(`[SupportTicketAnalytics] PDF export failed for userId ${userId}: ${err.message}`, err));
  };

  const handleExportCSV = () => {
    logger.info(`[SupportTicketAnalytics] CSV export initiated by userId: ${userId}`);
    alert('CSV Export functionality would be triggered here.');
    SupportApiService.exportAnalytics(userId, 'csv')
      .then(() => logger.info(`[SupportTicketAnalytics] CSV export successful for userId: ${userId}`))
      .catch(err => logger.error(`[SupportTicketAnalytics] CSV export failed for userId ${userId}: ${err.message}`, err));
  };

  const handleToggleChatbot = async () => {
    const newState = !isChatbotActive;
    logger.info(`[SupportTicketAnalytics] AI Chatbot toggle initiated by userId: ${userId}. New state: ${newState}`);
    try {
      await SupportApiService.toggleAIChatbot(userId, newState);
      setIsChatbotActive(newState);
      logger.info(`[SupportTicketAnalytics] AI Chatbot state successfully updated for userId ${userId} to ${newState}`);
      alert(`AI Chatbot ${newState ? 'activated' : 'deactivated'}.`);
    } catch (err) {
      logger.error(`[SupportTicketAnalytics] Failed to toggle AI Chatbot for userId ${userId}: ${err.message}`, err);
      setError('Failed to update AI Chatbot status.');
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500" aria-live="polite">Loading ticket analytics...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md" role="alert">{error}</div>;
  }

  if (!isPremium) {
    return <PremiumPrompt />;
  }

  if (!analyticsData) {
    return <div className="p-4 text-center text-gray-500">No analytics data available.</div>;
  }

  const { openTickets = 0, closedTickets = 0, avgResolutionTime = 'N/A', satisfactionRate = 'N/A' } = analyticsData;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Support Ticket Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-blue-700">Open Tickets</h3>
          <p className="text-3xl font-bold text-blue-600" aria-label={`Number of open tickets: ${openTickets}`}>{openTickets}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-green-700">Closed Tickets (Last 30 Days)</h3>
          <p className="text-3xl font-bold text-green-600" aria-label={`Number of closed tickets: ${closedTickets}`}>{closedTickets}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-yellow-700">Avg. Resolution Time</h3>
          <p className="text-3xl font-bold text-yellow-600" aria-label={`Average resolution time: ${avgResolutionTime}`}>{avgResolutionTime}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-purple-700">Satisfaction Rate</h3>
          <p className="text-3xl font-bold text-purple-600" aria-label={`Customer satisfaction rate: ${satisfactionRate}`}>{satisfactionRate}%</p>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Premium Features</h3>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
          <button
            onClick={handleExportPDF}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
            aria-label="Export analytics data as PDF"
          >
            Export to PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
            aria-label="Export analytics data as CSV"
          >
            Export to CSV
          </button>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium text-indigo-700">AI Chatbot Assistance</h4>
              <p className="text-sm text-indigo-600">Toggle AI to assist with analyzing trends and suggesting actions.</p>
            </div>
            <button
              onClick={handleToggleChatbot}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition duration-150 ease-in-out ${
                isChatbotActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              aria-pressed={isChatbotActive}
              aria-label={`Toggle AI Chatbot Assistance ${isChatbotActive ? 'off' : 'on'}`}
            >
              {isChatbotActive ? 'Deactivate AI Chatbot' : 'Activate AI Chatbot'}
            </button>
          </div>
          {isChatbotActive && (
            <p className="mt-3 text-sm text-green-600 italic" aria-live="polite">AI Chatbot is now active and analyzing data.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTicketAnalytics;
/**
 * File: MechanicRepairHistoryTimeline.jsx
 * Path: frontend/src/components/mechanic/MechanicRepairHistoryTimeline.jsx
 * Purpose: Displays a mechanic-facing visual timeline of past inspections, AI repairs, and maintenance actions for a given vehicle.
 * Author: Cod1 (05060842)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Timeline, TimelineItem } from '@/components/ui/timeline';
import { getVehicleRepairHistory } from '@/utils/repair/repairHistoryFetcher';
import { Loader } from '@/components/ui/Loader';

// --- Component Definition ---
/**
 * MechanicRepairHistoryTimeline Component
 * Purpose: Displays AI-tagged and mechanic-tagged repair/inspection entries as a visual timeline.
 * Props:
 *   - vehicleId (string): Vehicle identifier (e.g., VIN) to load history for
 * Returns: JSX visual timeline
 */
const MechanicRepairHistoryTimeline = ({ vehicleId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getVehicleRepairHistory(vehicleId);
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch repair history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [vehicleId]);

  if (loading) return <Loader label="Loading repair history..." />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Repair & Inspection Timeline</h2>
      <Timeline>
        {history.map((item, index) => (
          <TimelineItem
            key={index}
            title={item.title}
            timestamp={item.date}
            status={item.urgency >= 8 ? 'critical' : item.urgency >= 5 ? 'warning' : 'normal'}
          >
            <p className="text-sm text-gray-700">{item.description}</p>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

MechanicRepairHistoryTimeline.propTypes = {
  vehicleId: PropTypes.string.isRequired
};

export default MechanicRepairHistoryTimeline;

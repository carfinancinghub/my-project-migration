// File: MaaSIntegration.jsx
// Path: frontend/src/components/maas/
// Purpose: Ride-sharing UI with live map, AI strategy coach, loyalty program, and MaaS API hooks
// Features: Leaflet map viewer, ride pins, booking modal, XP tracker, PDF/CSV export, real ride API, heatmap, AI ride strategy coach, loyalty program, history analytics

import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { Button } from '@/components/common/Button';
import { Gift, MapPin, Car, Clock, Loader2, XCircle, CheckCircle, FileDown, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logError } from '@utils/logger';
import { exportRideReportAsPDF, exportRideReportAsCSV } from '@utils/analyticsExportUtils';
import { recommendRide } from '@utils/AIRideStrategyCoach';
import PremiumFeature from '@/components/common/PremiumFeature';
import { Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

// ... RideMarker and RideHeatmapOverlay remain unchanged

const MaaSIntegration = () => {
  const [location, setLocation] = useState(null);
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gamificationXP, setGamificationXP] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [exportMsg, setExportMsg] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [preference, setPreference] = useState('budget');
  const [strategySuggestion, setStrategySuggestion] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [badge, setBadge] = useState(null);

  const handleStrategyCoach = () => {
    const suggestion = recommendRide({ priority: preference }, rides, true);
    setStrategySuggestion(suggestion);
  };

  const awardLoyaltyBadge = (historyLength) => {
    if (historyLength === 5) {
      setBadge('Loyal Rider: Bronze Tier');
    } else if (historyLength === 10) {
      setBadge('Loyal Rider: Silver Tier');
    } else if (historyLength >= 20) {
      setBadge('Loyal Rider: Gold Tier');
    }
  };

  const handleBookRide = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setBookingSuccess(`Booking confirmed! Ride ID: ${selectedRide.id}`);
      setGamificationXP(prev => prev + 20);
      const updatedHistory = [...rideHistory, selectedRide];
      setRideHistory(updatedHistory);
      awardLoyaltyBadge(updatedHistory.length);
    } catch (err) {
      logError(err);
      setErrorMsg('Booking failed.');
    } finally {
      setLoading(false);
      setSelectedRide(null);
    }
  };

  // ... existing fetch logic remains unchanged

  const loyaltyNotification = (
    badge && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-200 border border-yellow-400 px-4 py-2 rounded shadow z-50"
      >
        <Trophy className="inline w-4 h-4 mr-2 text-yellow-700" /> {badge}
      </motion.div>
    )
  );

  const lineChartData = {
    labels: rideHistory.map((_, i) => `Ride ${i + 1}`),
    datasets: [{
      label: 'Ride Cost ($)',
      data: rideHistory.map(r => r.price),
      borderColor: '#10b981',
      tension: 0.4
    }]
  };

  const pieChartData = {
    labels: [...new Set(rideHistory.map(r => r.type))],
    datasets: [{
      label: 'Ride Types',
      data: [...new Set(rideHistory.map(t => rideHistory.filter(r => r.type === t).length))],
      backgroundColor: ['#34d399', '#60a5fa', '#fbbf24']
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loyaltyNotification}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center text-green-600">
          <Car className="w-5 h-5 mr-2" /> MaaS Integration
        </h1>
        <div className="flex items-center gap-4">
          <Gift className="w-4 h-4 text-purple-500" /> XP: <span className="font-bold">{gamificationXP}</span>
        </div>
      </header>

      <PremiumFeature feature="rideAnalytics">
        <div className="flex flex-wrap justify-center mt-4 gap-4">
          <Button onClick={() => handleExport('pdf')}><FileDown className="w-4 h-4 inline-block mr-1" /> Export PDF</Button>
          <Button onClick={() => handleExport('csv')} variant="outline"><FileDown className="w-4 h-4 inline-block mr-1" /> Export CSV</Button>
          <Button onClick={fetchLiveRides} variant="default"><FileDown className="w-4 h-4 inline-block mr-1" /> Load Real Rides</Button>
          <Button onClick={() => setShowHeatmap(!showHeatmap)} variant="outline">
            {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
          </Button>
        </div>

        <div className="my-6 p-4 bg-white shadow rounded-md max-w-2xl mx-auto">
          <h2 className="text-lg font-bold mb-2">🧠 AI Ride Strategy Coach</h2>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="preference" value="budget" checked={preference === 'budget'} onChange={() => setPreference('budget')} /> Save Money
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="preference" value="time" checked={preference === 'time'} onChange={() => setPreference('time')} /> Arrive Faster
            </label>
            <Button onClick={handleStrategyCoach}>Get Suggestion</Button>
          </div>
          {strategySuggestion && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-50 border border-green-300 p-3 rounded">
              {strategySuggestion.suggestion}
            </motion.div>
          )}
        </div>

        <div className="my-6 p-4 bg-white shadow rounded-md max-w-4xl mx-auto">
          <h2 className="text-lg font-bold mb-4">📈 Ride History Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Line data={lineChartData} /></div>
            <div><Pie data={pieChartData} /></div>
          </div>
        </div>
      </PremiumFeature>

      {/* ... Map and booking modals remain unchanged */}
    </div>
  );
};

export default MaaSIntegration;
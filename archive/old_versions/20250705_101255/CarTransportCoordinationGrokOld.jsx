// File: CarTransportCoordination.jsx
// Path: frontend/src/components/hauler/CarTransportCoordination.jsx
// Author: Cod3
// Purpose: Ultimate Crown Certified module for AI-augmented car transport coordination
// Sections:
// - Geo Initialization (User location)
// - Strategy Coach & Route Optimizer
// - Booking Flow & Loyalty Engine
// - Export, Chart, and Share Features
// - Map Viewer with Framer Motion & Leaflet

import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/common/Button';
import { Gift, MapPin, Truck, Clock, Loader2, XCircle, CheckCircle, FileDown, Trophy, Share2, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logError } from '@utils/logger';
import { exportRideReportAsPDF, exportRideReportAsCSV } from '@utils/analyticsExportUtils';
import { recommendTransport, optimizeRoute } from '@utils/AICarTransportCoordinator';
import { generateShareContent, shareToPlatform } from '@utils/SocialShareHelper';
import PremiumFeature from '@/components/common/PremiumFeature';
import { Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const CarTransportCoordination = () => {
  // === State Definitions ===
  const [location, setLocation] = useState(null);
  const [transports, setTransports] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gamificationXP, setGamificationXP] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [preference, setPreference] = useState('budget');
  const [strategySuggestion, setStrategySuggestion] = useState(null);
  const [transportHistory, setTransportHistory] = useState([]);
  const [badge, setBadge] = useState(null);
  const [availabilityAlerts, setAvailabilityAlerts] = useState([]);

  // === Geo Initialization ===
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      });
    }
  }, []);

  // === AI Coach & Optimizer ===
  const handleStrategyCoach = () => {
    const suggestion = recommendTransport({ priority: preference }, transports, true);
    setStrategySuggestion(suggestion);
  };

  const handleOptimizeRoute = () => {
    const route = optimizeRoute(location, transports);
    setOptimizedRoute(route);
  };

  // === Booking Flow ===
  const handleBookTransport = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setBookingSuccess(`Booking confirmed! Transport ID: ${selectedTransport.id}`);
      setGamificationXP(prev => prev + 25);
      const updatedHistory = [...transportHistory, selectedTransport];
      setTransportHistory(updatedHistory);
      awardLoyaltyBadge(updatedHistory.length);
    } catch (err) {
      logError(err);
      setErrorMsg('Transport booking failed.');
    } finally {
      setLoading(false);
      setSelectedTransport(null);
    }
  };

  const awardLoyaltyBadge = (historyLength) => {
    if (historyLength === 5) setBadge('Bronze Hauler Badge');
    else if (historyLength === 10) setBadge('Silver Hauler Badge');
    else if (historyLength >= 20) setBadge('Gold Hauler Badge');
  };

  // === Map Route Overlay ===
  const renderRouteOverlay = () => (
    <Polyline
      positions={optimizedRoute.map(p => [p.latitude, p.longitude])}
      pathOptions={{ color: '#3b82f6', weight: 5 }}
    />
  );

  // === Loyalty Notification ===
  const loyaltyNotification = (
    badge && (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-200 border border-yellow-400 px-4 py-2 rounded shadow z-50">
        <Trophy className="inline w-4 h-4 mr-2 text-yellow-700" /> {badge}
      </motion.div>
    )
  );

  // === Analytics Charts ===
  const lineChartData = {
    labels: transportHistory.map((_, i) => `Transport ${i + 1}`),
    datasets: [{ label: 'Transport Cost ($)', data: transportHistory.map(t => t.price), borderColor: '#10b981', tension: 0.4 }]
  };

  const pieChartData = {
    labels: [...new Set(transportHistory.map(t => t.type))],
    datasets: [{ label: 'Transport Types', data: [...new Set(transportHistory.map(t => transportHistory.filter(h => h.type === t).length))], backgroundColor: ['#34d399', '#60a5fa', '#fbbf24'] }]
  };

  // === Component Render ===
  return (
    <div className="min-h-screen bg-gray-100">
      {loyaltyNotification}

      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center text-green-600">
          <Truck className="w-5 h-5 mr-2" /> Car Transport Coordination
        </h1>
        <div className="flex items-center gap-4">
          <Gift className="w-4 h-4 text-purple-500" /> XP: <span className="font-bold">{gamificationXP}</span>
        </div>
      </header>

      <PremiumFeature feature="transportAnalytics">
        <div className="flex flex-wrap justify-center mt-4 gap-4">
          <Button onClick={() => exportRideReportAsPDF(transportHistory)}><FileDown className="w-4 h-4 inline-block mr-1" /> Export PDF</Button>
          <Button onClick={() => exportRideReportAsCSV(transportHistory)} variant="outline"><FileDown className="w-4 h-4 inline-block mr-1" /> Export CSV</Button>
        </div>

        <div className="my-6 p-4 bg-white shadow rounded-md max-w-2xl mx-auto">
          <h2 className="text-lg font-bold mb-2">🧠 AI Transport Strategy Coach</h2>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="preference" value="budget" checked={preference === 'budget'} onChange={() => setPreference('budget')} /> Save Money
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="preference" value="time" checked={preference === 'time'} onChange={() => setPreference('time')} /> Fastest Delivery
            </label>
            <Button onClick={handleStrategyCoach}>Get Suggestion</Button>
            <Button onClick={handleOptimizeRoute} className="bg-indigo-500 text-white"><Navigation className="w-4 h-4 mr-1" /> Optimize Route</Button>
          </div>
          {strategySuggestion && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-50 border border-green-300 p-3 rounded">
              {strategySuggestion.suggestion}
            </motion.div>
          )}
        </div>

        <div className="my-6 p-4 bg-white shadow rounded-md max-w-4xl mx-auto">
          <h2 className="text-lg font-bold mb-4">📈 Transport History Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Line data={lineChartData} /></div>
            <div><Pie data={pieChartData} /></div>
          </div>
        </div>

        {badge && (
          <div className="text-center mt-4">
            <Button onClick={() => shareToPlatform('twitter', generateShareContent('badge', { badge }))} className="bg-blue-500 text-white flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share your {badge}
            </Button>
          </div>
        )}
      </PremiumFeature>

      <main className="p-4">
        <MapContainer center={[location?.latitude || 37.773972, location?.longitude || -122.431297]} zoom={12} className="h-[500px] rounded-lg z-10">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {location && <Marker position={[location.latitude, location.longitude]}><Popup>Your Location</Popup></Marker>}
          {transports.map((t, i) => (<Marker key={i} position={[t.latitude, t.longitude]}><Popup>{t.type} - ${t.price}</Popup></Marker>))}
          {optimizedRoute.length > 0 && renderRouteOverlay()}
        </MapContainer>
      </main>
    </div>
  );
};

export default CarTransportCoordination;

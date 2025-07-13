// File: CarTransportCoordination.jsx
// Path: frontend/src/components/hauler/CarTransportCoordination.jsx
// Author: Cod5 (05051845, May 5, 2025)
// Purpose: Coordinate car transport services with AI Coach, Forecasting, Booking, Analytics, Loyalty, Social Sharing, Route Optimization, real-time collaboration chat, and roadside assistance alerts

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { Button } from '@components/common/Button';
import { Gift, Truck, FileDown, Trophy, Share2, Navigation, TrendingUp, AlertTriangle } from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { toast } from 'react-toastify';
import { logError } from '@utils/logger';
import { exportRideReportAsPDF, exportRideReportAsCSV } from '@utils/analyticsExportUtils';
import { recommendTransport, optimizeRoute } from '@utils/AICarTransportCoordinator';
import { forecastTransportCost, analyzeCostTrends } from '@utils/AICarTransportCostForecaster';
import { generateShareContent, shareToPlatform } from '@utils/SocialShareHelper';
import { awardLoyaltyBadge } from '@utils/gamificationUtils';
import PremiumFeature from '@components/common/PremiumFeature';
import CollaborationChat from '@hauler/CollaborationChat';
import { subscribeToWebSocket } from '@lib/websocket';
import axios from 'axios';

// === Interfaces ===
interface Transport {
  id: string;
  type: string;
  price: number;
  latitude: number;
  longitude: number;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface StrategySuggestion {
  suggestion: string;
}

interface ForecastData {
  prediction: string;
  chartData: any; // Replace with specific Chart.js type if needed
}

interface Props {
  transportId: string;
  haulerId: string;
  isPremium: boolean;
}

// === Component ===
const CarTransportCoordination: React.FC<Props> = ({ transportId, haulerId, isPremium }) => {
  // === State Setup ===
  const [location, setLocation] = useState<Location | null>(null);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<Location[]>([]);
  const [gamificationXP, setGamificationXP] = useState<number>(0);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [preference, setPreference] = useState<'budget' | 'time'>('budget');
  const [strategySuggestion, setStrategySuggestion] = useState<StrategySuggestion | null>(null);
  const [transportHistory, setTransportHistory] = useState<Transport[]>([]);
  const [badge, setBadge] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isChatOpen, setChatOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roadsideAlert, setRoadsideAlert] = useState<string | null>(null);

  // === Geolocation Setup ===
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          logError(err);
          toast.error('Failed to get location.');
          setErrorMsg('Failed to get location.');
        }
      );
    }
  }, []);

  // === Accessibility: Close chat modal on Escape key ===
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setChatOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // === Roadside Alerts (Enterprise) ===
  useEffect(() => {
    if (!isPremium) return;
    const unsubscribe = subscribeToWebSocket('roadsideAlert', (msg: string) => {
      setRoadsideAlert(msg);
      setTimeout(() => setRoadsideAlert(null), 6000);
    });
    return () => unsubscribe();
  }, [isPremium]);

  // === Strategy Coach ===
  const handleStrategyCoach = useCallback(() => {
    try {
      const suggestion = recommendTransport({ priority: preference }, transports, true);
      setStrategySuggestion(suggestion);
    } catch (err) {
      logError(err);
      toast.error('Failed to generate strategy suggestion.');
      setErrorMsg('Failed to generate strategy suggestion.');
    }
  }, [preference, transports]);

  // === Route Optimization ===
  const handleOptimizeRoute = useCallback(() => {
    try {
      setIsLoading(true);
      const route = optimizeRoute(location, transports);
      setOptimizedRoute(route);
    } catch (err) {
      logError(err);
      toast.error('Failed to optimize route.');
      setErrorMsg('Failed to optimize route.');
    } finally {
      setIsLoading(false);
    }
  }, [location, transports]);

  // === Cost Forecasting ===
  const fetchCostForecast = useCallback(async () => {
    setIsLoading(true);
    try {
      const prediction = forecastTransportCost(transportHistory);
      const trends = analyzeCostTrends(transportHistory);
      setForecastData({ prediction, chartData: trends });
    } catch (err) {
      logError(err);
      toast.error('Failed to fetch cost forecast.');
      setErrorMsg('Failed to fetch cost forecast.');
    } finally {
      setIsLoading(false);
    }
  }, [transportHistory]);

  // === Booking Logic ===
  const handleBookTransport = useCallback(async () => {
    if (!selectedTransport) return;
    setIsLoading(true);
    try {
      const booked = selectedTransport;
      setBookingSuccess(`Booking confirmed! Transport ID: ${booked.id}`);
      setGamificationXP((prev) => prev + 25);
      const updatedHistory = [...transportHistory, booked];
      setTransportHistory(updatedHistory);
      const newBadge = awardLoyaltyBadge(updatedHistory.length);
      if (newBadge) setBadge(newBadge);
      toast.success('Booking confirmed!');
    } catch (err) {
      logError(err);
      toast.error('Transport booking failed.');
      setErrorMsg('Transport booking failed.');
    } finally {
      setSelectedTransport(null);
      setIsLoading(false);
    }
  }, [selectedTransport, transportHistory]);

  // === Roadside Assistance Request (Enterprise) ===
  const handleRoadsideAssist = useCallback(async () => {
    if (!isPremium || !selectedTransport?.id) return;
    setIsLoading(true);
    try {
      await axios.post(`/api/hauler/roadside-assist/${selectedTransport.id}`);
      toast.success('Roadside assistance requested!');
    } catch (err) {
      logError(err);
      toast.error('Failed to request roadside assistance.');
      setErrorMsg('Failed to request roadside assistance.');
    } finally {
      setIsLoading(false);
    }
  }, [isPremium, selectedTransport]);

  // === Chart Data ===
  const lineChartData = useMemo(() => ({
    labels: transportHistory.map((_, i) => `Transport ${i + 1}`),
    datasets: [
      {
        label: 'Transport Cost ($)',
        data: transportHistory.map((t) => t.price),
        borderColor: '#10b981',
        tension: 0.4,
      },
    ],
  }), [transportHistory]);

  const pieChartData = useMemo(() => ({
    labels: [...new Set(transportHistory.map((t) => t.type))],
    datasets: [
      {
        label: 'Transport Types',
        data: [...new Set(transportHistory.map((t) => t.type))].map((type) =>
          transportHistory.filter((h) => h.type === type).length
        ),
        backgroundColor: ['#34d399', '#60a5fa', '#fbbf24'],
      },
    ],
  }), [transportHistory]);

  // === Render ===
  return (
    <div className="min-h-screen bg-gray-50">
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-200 px-4 py-2 rounded shadow"
          role="alert"
        >
          <Trophy className="inline w-4 h-4 mr-2 text-yellow-700" /> {badge}
        </motion.div>
      )}
      {roadsideAlert && isPremium && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow z-50 flex items-center gap-2"
          role="alert"
        >
          <AlertTriangle className="w-4 h-4" /> {roadsideAlert}
        </motion.div>
      )}

      {/* === Header === */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center text-green-600">
          <Truck className="w-5 h-5 mr-2" /> Car Transport Coordination
        </h1>
        <div className="flex gap-4 items-center">
          <Gift className="w-4 h-4 text-purple-500" /> XP: {gamificationXP}
        </div>
      </header>

      {/* === Premium Panels === */}
      <PremiumFeature feature="transportAnalytics">
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Button onClick={() => exportRideReportAsPDF(transportHistory)} disabled={isLoading}>
            <FileDown className="w-4 h-4 mr-1" /> Export PDF
          </Button>
          <Button onClick={() => exportRideReportAsCSV(transportHistory)} variant="outline" disabled={isLoading}>
            <FileDown className="w-4 h-4 mr-1" /> Export CSV
          </Button>
        </div>

        {/* === Strategy Coach + Forecast Panels === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mx-auto my-6">
          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-bold mb-2">🧠 AI Transport Strategy Coach</h2>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pref"
                  value="budget"
                  checked={preference === 'budget'}
                  onChange={() => setPreference('budget')}
                  className="mr-1"
                />
                Budget
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pref"
                  value="time"
                  checked={preference === 'time'}
                  onChange={() => setPreference('time')}
                  className="mr-1"
                />
                Time
              </label>
              <Button onClick={handleStrategyCoach} disabled={isLoading}>Suggest</Button>
              <Button onClick={handleOptimizeRoute} disabled={isLoading}>
                <Navigation className="w-4 h-4 mr-1" /> Optimize
              </Button>
              {isPremium && (
                <Button onClick={handleRoadsideAssist} variant="destructive" disabled={isLoading || !selectedTransport}>
                  Request Roadside
                </Button>
              )}
            </div>
            {strategySuggestion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 p-3 rounded border mt-2"
              >
                {strategySuggestion.suggestion}
              </motion.div>
            )}
          </div>

          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-bold mb-2">📉 AI Cost Forecast Panel</h2>
            <Button onClick={fetchCostForecast} className="mb-2" disabled={isLoading}>
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" /> Fetch Forecast
                </>
              )}
            </Button>
            {forecastData && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-sm text-gray-700 mb-2">Prediction: {forecastData.prediction}</div>
                <Line data={forecastData.chartData} />
              </motion.div>
            )}
          </div>
        </div>

        {/* === Transport History Charts === */}
        <div className="p-4 bg-white shadow rounded max-w-4xl mx-auto">
          <h2 className="text-lg font-bold mb-4">📈 Transport History Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Line data={lineChartData} options={{ plugins: { legend: { labels: { usePointStyle: true } } } }} />
            <Pie data={pieChartData} options={{ plugins: { legend: { labels: { usePointStyle: true } } } }} />
          </div>
        </div>

        {/* === Social Sharing === */}
        <div className="text-center mt-4">
          {badge && (
            <Button
              onClick={() => shareToPlatform('twitter', generateShareContent('badge', { badge }))}
              className="bg-blue-500 text-white flex gap-2 mx-2"
              disabled={isLoading}
            >
              <Share2 className="w-4 h-4" /> Share your {badge}
            </Button>
          )}
          <Button
            onClick={() => shareToPlatform('twitter', generateShareContent('summary', { history: transportHistory }))}
            className="bg-blue-500 text-white flex gap-2 mx-2"
            disabled={isLoading}
          >
            <Share2 className="w-4 h-4" /> Share Transport Summary
          </Button>
        </div>
      </PremiumFeature>

      {/* === Map Viewer === */}
      <main className="p-4">
        <MapContainer
          center={[location?.latitude || 37.77, location?.longitude || -122.43]}
          zoom={12}
          className="h-[500px] rounded"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {location && (
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {transports.map((t, i) => (
            <Marker key={i} position={[t.latitude, t.longitude]} eventHandlers={{ click: () => setSelectedTransport(t) }}>
              <Popup>
                {t.type} - ${t.price}
              </Popup>
            </Marker>
          ))}
          {optimizedRoute.length > 0 && (
            <Polyline
              positions={optimizedRoute.map((p) => [p.latitude, p.longitude])}
              pathOptions={{ color: '#3b82f6', weight: 5 }}
            />
          )}
        </MapContainer>
        {selectedTransport && (
          <div className="text-center mt-4">
            <Button onClick={handleBookTransport} disabled={isLoading}>
              {isLoading ? 'Booking...' : `Book ${selectedTransport.type} for $${selectedTransport.price}`}
            </Button>
          </div>
        )}
      </main>

      {/* === Chat Integration === */}
      <PremiumFeature feature="collaborationChat">
        <div className="p-4 text-center">
          <Button
            onClick={() => setChatOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            aria-label="Open chat with buyer"
            disabled={isLoading}
          >
            Chat with Buyer
          </Button>
        </div>
      </PremiumFeature>

      {/* === Chat Modal === */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-fade-in"
          role="dialog"
          aria-labelledby="chat-modal-title"
        >
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 id="chat-modal-title" className="text-lg font-semibold text-gray-800 mb-4">
              Chat with Buyer
            </h3>
            <CollaborationChat
              userId={haulerId}
              auctionId={transportId}
              isPremium={isPremium}
              role="hauler"
            />
            <Button
              onClick={() => setChatOpen(false)}
              className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              aria-label="Close chat"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* === Status Messages === */}
      {errorMsg && (
        <div className="p-4 text-center text-red-600" role="alert" aria-live="assertive">
          {errorMsg}
        </div>
      )}
      {bookingSuccess && (
        <div className="p-4 text-center text-green-600" role="status" aria-live="polite">
          {bookingSuccess}
        </div>
      )}
    </div>
  );
};

export default CarTransportCoordination;

// === Utility Function (in @utils/gamificationUtils.ts) ===
export const awardLoyaltyBadge = (count: number): string | null => {
  if (count === 5) return 'Bronze Hauler Badge';
  if (count === 10) return 'Silver Hauler Badge';
  if (count >= 20) return 'Gold Hauler Badge';
  return null;
};
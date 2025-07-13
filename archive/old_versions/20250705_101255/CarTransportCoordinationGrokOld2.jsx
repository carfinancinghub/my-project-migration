// File: CarTransportCoordination.jsx
// Path: frontend/src/components/hauler/CarTransportCoordination.jsx
// Author: Cod3
// Purpose: Coordinate car transport services (haulers, roadside assistance) for the car marketplace

import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/common/Button';
import { Gift, MapPin, Truck, Clock, Loader2, XCircle, CheckCircle, FileDown, Trophy, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logError } from '@utils/logger';
import { exportRideReportAsPDF, exportRideReportAsCSV } from '@utils/analyticsExportUtils';
import { recommendTransport } from '@utils/AICarTransportCoordinator';
import { generateShareContent, shareToPlatform } from '@utils/SocialShareHelper';
import PremiumFeature from '@/components/common/PremiumFeature';
import { Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

// ...rest of logic remains unchanged

{badge && (
  <div className="text-center mt-4">
    <PremiumFeature feature="transportAnalytics">
      <Button
        onClick={() => shareToPlatform('twitter', generateShareContent('badge', { badge }))}
        className="bg-blue-500 text-white flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" /> Share your {badge}
      </Button>
    </PremiumFeature>
  </div>
)}

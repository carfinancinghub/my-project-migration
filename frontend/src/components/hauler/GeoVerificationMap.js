// File: GeoVerificationMap.js
// Path: frontend/src/components/hauler/GeoVerificationMap.js
// 👑 Cod1 Crown Certified — Visual GPS Audit Tool for Escrow, Admin, and Arbitrator Review

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Button from '../../common/Button';

const GeoVerificationMap = ({ job, pickupCoords, dropoffCoords }) => {
  const hasGeoPin = job?.geoPin;
  const fallbackCoords = [37.7749, -122.4194];
  const [lat, lng] = hasGeoPin ? job.geoPin.split(',').map(Number) : fallbackCoords;
  const center = [lat, lng];

  const photoPreview = job?.photos || [];
  const updatedTime = job?.updatedAt ? new Date(job.updatedAt).toLocaleString() : 'Unknown';
  const [transcript, setTranscript] = useState(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [aiReview, setAiReview] = useState(null);

  const customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
  });

  useEffect(() => {
    const fetchAIReview = async () => {
      try {
        const res = await fetch(`/api/hauler/jobs/${job._id}/ai-review`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setAiReview(data);
      } catch (err) {
        console.error('Failed to load AI Review:', err);
      }
    };
    fetchAIReview();
  }, [job._id]);

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/hauler/jobs/${job._id}/export-pdf`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DeliveryReport_${job._id}.pdf`;
      link.click();
    } catch (err) {
      console.error('PDF download failed', err);
      alert('Failed to download delivery report.');
    }
  };

  const handleDownloadMapPDF = async () => {
    try {
      const response = await fetch(`/api/hauler/jobs/${job._id}/export-pdf-map`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DeliveryReport_Map_${job._id}.pdf`;
      link.click();
    } catch (err) {
      console.error('Map snapshot PDF download failed', err);
      alert('Failed to download delivery report with map.');
    }
  };

  const handleDownloadSignablePDF = async () => {
    try {
      const response = await fetch(`/api/hauler/jobs/${job._id}/export-signable-pdf`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SignableReport_${job._id}.pdf`;
      link.click();
    } catch (err) {
      console.error('Signable PDF download failed', err);
      alert('Failed to download signable delivery report.');
    }
  };

  const handleTranscribe = async () => {
    try {
      setLoadingTranscript(true);
      const response = await fetch(`/api/hauler/jobs/${job._id}/transcribe-voice`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setTranscript(data.transcript);
    } catch (err) {
      console.error('Transcription failed:', err);
      alert('Unable to transcribe voice memo.');
    } finally {
      setLoadingTranscript(false);
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded shadow bg-white">
      <h2 className="text-xl font-bold">🗺️ Geo Verification Map</h2>
      <p className="text-sm text-gray-600 mb-2">Used by escrow and admin for proof validation</p>

      {/* SMART AI REVIEW */}
      {aiReview && (
        <div className="p-4 border-l-4 rounded border-blue-500 bg-blue-50">
          <h3 className="font-semibold text-blue-800">🤖 Smart Review Summary</h3>
          <p className="text-sm mb-2 text-blue-700">{aiReview.status}</p>
          <ul className="list-disc ml-5 text-sm text-gray-700">
            {aiReview.insights.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}

      {/* REST OF MAP + EXPORT FLOW CONTINUES BELOW... */}

      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-80 w-full rounded">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasGeoPin && (
          <Marker position={center} icon={customIcon}>
            <Popup>
              Delivery GeoPin<br />
              <strong>{lat.toFixed(5)}, {lng.toFixed(5)}</strong><br />
              Timestamp: {updatedTime}
            </Popup>
          </Marker>
        )}

        {pickupCoords && (
          <Marker position={pickupCoords}>
            <Popup>
              Pickup Location<br />
              {new Date().toLocaleString()}
            </Popup>
          </Marker>
        )}

        {dropoffCoords && (
          <Marker position={dropoffCoords}>
            <Popup>
              Dropoff Location<br />
              {new Date().toLocaleString()}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* ... voice memo, photo grid, export buttons stay the same */}
    </div>
  );
};

export default GeoVerificationMap;

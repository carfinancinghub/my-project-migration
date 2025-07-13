// File: HaulerJobUploadForm.js
// Path: frontend/src/components/hauler/HaulerJobUploadForm.js
// 👑 Cod1 Crown Certified — Proof Upload + Voice Notes + Timestamped Photos

import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';
import { theme } from '../../styles/theme';

const HaulerJobUploadForm = ({ jobId, onUploadComplete }) => {
  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState('');
  const [geoPin, setGeoPin] = useState('');
  const [voiceNote, setVoiceNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const handlePhotoChange = (e) => setPhotos([...e.target.files]);
  const handleVoiceChange = (e) => setVoiceNote(e.target.files[0]);
  const handleGeoPin = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoPin(`${position.coords.latitude},${position.coords.longitude}`);
      },
      (err) => alert('Failed to get location')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      photos.forEach((file) => formData.append('photos', file));
      formData.append('notes', notes);
      formData.append('geoPin', geoPin);
      if (voiceNote) formData.append('voiceNote', voiceNote);

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/hauler/jobs/${jobId}/upload-proof`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      onUploadComplete();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('❌ Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 border rounded shadow bg-white"
    >
      <h2 className="text-lg font-semibold">📤 Upload Delivery Proof</h2>

      <div>
        <label className="block text-sm font-medium">Upload Photos</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Optional Voice Note (.mp3)</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleVoiceChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          rows="4"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., Vehicle had front bumper scratches at pickup."
        />
      </div>

      <div className="space-y-2">
        <Button type="button" onClick={handleGeoPin} variant="secondary">
          📍 Capture Location
        </Button>
        {geoPin && <p className="text-sm text-gray-600">GeoPin: {geoPin}</p>}
      </div>

      {error && <p className={theme.errorText}>{error}</p>}
      {loading ? <LoadingSpinner /> : <Button type="submit">✅ Submit</Button>}
    </form>
  );
};

export default HaulerJobUploadForm;

// File: InspectionForm.js
// Path: frontend/src/components/mechanic/InspectionForm.js

import React, { useState } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import Card from '../common/Card';
import { theme } from '../../styles/theme';

const InspectionForm = ({ jobId }) => {
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const token = localStorage.getItem('token');

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('notes', notes);
      if (photo) formData.append('photo', photo);

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/mechanic/jobs/${jobId}/inspect`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('✅ Inspection submitted successfully');
      setNotes('');
      setPhoto(null);
    } catch (err) {
      console.error('Inspection submission error:', err);
      setMessage('❌ Failed to submit inspection');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Inspection Form</h2>

        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe inspection findings..."
            className="w-full p-2 border rounded mt-1"
            rows={4}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="mt-1"
          />
        </div>

        {message && <p className={theme.errorText}>{message}</p>}

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Inspection'}
        </Button>
      </form>
    </Card>
  );
};

export default InspectionForm;

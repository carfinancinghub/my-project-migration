// File: submitInspectionToBackend.js
// Path: frontend/src/utils/inspection/submitInspectionToBackend.js
// Author: Cod1 (05051059)
// Purpose: Handle secure submission of inspection data (notes + photo)
// Functions:
// - submitInspection(form, token): posts form data to backend for a given jobId

import axios from 'axios';

export const submitInspection = async (jobId, { notes, photo }, token) => {
  const formData = new FormData();
  formData.append('notes', notes);
  if (photo) formData.append('photo', photo);

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/mechanic/jobs/${jobId}/inspect`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return { success: true, message: '✅ Inspection submitted successfully', data: res.data };
  } catch (err) {
    console.error('❌ Inspection submission failed:', err);
    return { success: false, message: '❌ Submission failed. Please try again.' };
  }
};

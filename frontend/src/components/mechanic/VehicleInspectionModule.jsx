// File: VehicleInspectionModule.jsx
// Path: frontend/src/components/mechanic/VehicleInspectionModule.jsx
// Author: Cod1 (05051047)
// Purpose: Handle vehicle inspection inputs and submit inspection forms
// Functions:
// - Display inspection checklist and fields
// - Preview and upload inspection photos with drag-and-drop
// - Submit inspection data
// - Gate AI analysis under mechanicEnterprise

import React, { useState } from 'react';
import PremiumFeature from '@components/common/PremiumFeature';
import { useLanguage } from '@components/common/MultiLanguageSupport';

const VehicleInspectionModule = () => {
  const { getTranslation } = useLanguage();
  const [inspectionData, setInspectionData] = useState({
    vehicleId: '',
    tires: false,
    fluids: false,
    photos: [],
    notes: ''
  });

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setInspectionData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setInspectionData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const handleSubmit = () => {
    console.log('Submitting inspection:', inspectionData);
    // TODO: POST to backend
  };

  const removePhoto = (index) => {
    setInspectionData((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos.splice(index, 1);
      return { ...prev, photos: newPhotos };
    });
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">{getTranslation('vehicleInspection')}</h2>

      <input
        type="text"
        placeholder={getTranslation('vehicleId')}
        className="mb-2 w-full border rounded px-2 py-1"
        value={inspectionData.vehicleId}
        onChange={(e) => setInspectionData({ ...inspectionData, vehicleId: e.target.value })}
      />

      <div className="flex space-x-4 mb-2">
        <label>
          <input
            type="checkbox"
            checked={inspectionData.tires}
            onChange={(e) => setInspectionData({ ...inspectionData, tires: e.target.checked })}
          />{' '}
          {getTranslation('checkTires')}
        </label>
        <label>
          <input
            type="checkbox"
            checked={inspectionData.fluids}
            onChange={(e) => setInspectionData({ ...inspectionData, fluids: e.target.checked })}
          />{' '}
          {getTranslation('checkFluids')}
        </label>
      </div>

      <textarea
        placeholder={getTranslation('notes')}
        className="w-full border rounded px-2 py-1 mb-2"
        rows="3"
        value={inspectionData.notes}
        onChange={(e) => setInspectionData({ ...inspectionData, notes: e.target.value })}
      />

      <div
        className="w-full border-2 border-dashed border-gray-300 rounded p-4 text-center mb-4 bg-gray-50"
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p className="text-sm text-gray-600">{getTranslation('dragDropPhotos')}</p>
        <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mt-2" />
      </div>

      {inspectionData.photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
          {inspectionData.photos.map((file, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${i}`}
                className="w-full h-32 object-cover rounded"
              />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <PremiumFeature feature="mechanicEnterprise">
        <div className="bg-gray-100 border rounded p-3 mb-2">
          <p className="text-sm text-gray-700">{getTranslation('aiDamageDetection')} ✅</p>
        </div>
      </PremiumFeature>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {getTranslation('submitInspection')}
      </button>
    </div>
  );
};

export default VehicleInspectionModule;

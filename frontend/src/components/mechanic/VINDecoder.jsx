// File: VINDecoder.jsx
// Path: frontend/src/components/mechanic/VINDecoder.jsx
// Author: Cod1 (05051245)

import React, { useState } from 'react';
import axios from 'axios';
import Card from '@components/common/Card';
import { getTranslation, useLanguage } from '@components/common/MultiLanguageSupport';

const VINDecoder = () => {
  const [vin, setVin] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  const handleDecode = async () => {
    try {
      setError(null);
      // Simulated response
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({
          data: { make: 'Honda', model: 'Accord', year: 2003 }
        }), 800)
      );
      setData(response.data);
    } catch (err) {
      setError('Failed to decode VIN');
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-2">{getTranslation('vinDecoder', language)}</h2>
      <input
        type="text"
        value={vin}
        onChange={(e) => setVin(e.target.value)}
        placeholder="Enter VIN"
        className="w-full border rounded p-2 mb-2"
      />
      <button onClick={handleDecode} className="bg-blue-600 text-white px-4 py-2 rounded">
        {getTranslation('decode', language)}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {data && (
        <div className="mt-4">
          <p><strong>Make:</strong> {data.make}</p>
          <p><strong>Model:</strong> {data.model}</p>
          <p><strong>Year:</strong> {data.year}</p>
        </div>
      )}
    </Card>
  );
};

export default VINDecoder;

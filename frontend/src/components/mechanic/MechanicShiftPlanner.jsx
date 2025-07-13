// File: MechanicShiftPlanner.jsx
// Path: frontend/src/components/mechanic/MechanicShiftPlanner.jsx
// Author: Cod1 (05051245)

import React, { useState } from 'react';
import Card from '@components/common/Card';
import { getTranslation, useLanguage } from '@components/common/MultiLanguageSupport';

const MechanicShiftPlanner = () => {
  const [shifts, setShifts] = useState([
    { date: '2025-05-05', hours: '09:00 - 17:00', tasks: ['Inspect VIN123', 'Repair VIN456'] },
    { date: '2025-05-06', hours: '10:00 - 18:00', tasks: ['Diagnose VIN789'] }
  ]);
  const { language } = useLanguage();

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-2">{getTranslation('shiftPlanner', language)}</h2>
      {shifts.map((shift, i) => (
        <div key={i} className="border p-3 mb-2 rounded bg-gray-50">
          <p><strong>Date:</strong> {shift.date}</p>
          <p><strong>Hours:</strong> {shift.hours}</p>
          <p><strong>Tasks:</strong> {shift.tasks.join(', ')}</p>
        </div>
      ))}
    </Card>
  );
};

export default MechanicShiftPlanner;

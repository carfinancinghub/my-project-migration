// File: MechanicTaskHistoryTable.jsx
// Path: frontend/src/components/mechanic/MechanicTaskHistoryTable.jsx
// Author: Cod1 (05051059)
// Purpose: Display mechanic's historical task records in table format
// Functions:
// - Render task rows with vehicle info, outcome, and notes
// - Gate export option behind mechanicPro

import React from 'react';
import PremiumFeature from '@components/common/PremiumFeature';
import { useLanguage } from '@components/common/MultiLanguageSupport';
import { Button } from '@components/common/Button';

const MechanicTaskHistoryTable = ({ tasks }) => {
  const { getTranslation } = useLanguage();

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">{getTranslation('taskHistory')}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 text-sm">{getTranslation('vehicle')}</th>
              <th className="text-left p-2 text-sm">{getTranslation('issue')}</th>
              <th className="text-left p-2 text-sm">{getTranslation('status')}</th>
              <th className="text-left p-2 text-sm">{getTranslation('notes')}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 text-sm">{t.vehicle}</td>
                <td className="p-2 text-sm">{t.issue}</td>
                <td className="p-2 text-sm">{t.status}</td>
                <td className="p-2 text-sm whitespace-pre-wrap">{t.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PremiumFeature feature="mechanicPro">
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => alert('Exporting task history...')}>
            {getTranslation('exportTasks')}
          </Button>
        </div>
      </PremiumFeature>
    </div>
  );
};

export default MechanicTaskHistoryTable;

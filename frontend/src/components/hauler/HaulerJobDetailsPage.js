// File: HaulerJobDetailsPage.js
// Path: frontend/src/components/hauler/HaulerJobDetailsPage.js
// 👑 Cod1 Crown Certified — Unified Delivery Status + Upload Suite for Haulers

import React from 'react';
import HaulerJobStatus from './HaulerJobStatus';
import HaulerJobUploadForm from './HaulerJobUploadForm';
import { useParams } from 'react-router-dom';
import ErrorBoundary from '../../common/ErrorBoundary';

const HaulerJobDetailsPage = () => {
  const { jobId } = useParams();

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🛠️ Delivery Job Details</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <HaulerJobStatus jobId={jobId} />
          </div>

          <div>
            <HaulerJobUploadForm jobId={jobId} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default HaulerJobDetailsPage;

// File: EscrowTransactionDetailModal.jsx
// Path: frontend/src/components/escrow/EscrowTransactionDetailModal.jsx
// Author: Cod2 (05071955)
// Description: Modal showing full detail of escrow transaction with tabs for metadata, payment, checklist, audit log, and linked mechanic inspection report.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/common/Modal';
import EscrowConditionChecklist from './EscrowConditionChecklist';
import SharedReportViewer from '@/components/mechanic/SharedReportViewer';

const EscrowTransactionDetailModal = ({ escrow, onClose }) => {
  const [activeTab, setActiveTab] = useState('metadata');

  const tabClasses = (tab) =>
    `px-4 py-2 cursor-pointer ${activeTab === tab ? 'border-b-2 border-indigo-600 font-semibold' : 'text-gray-500'}`;

  return (
    <Modal onClose={onClose} title={`Transaction ${escrow?.dealId || 'Unknown'}`}>
      <div className="flex border-b mb-4">
        <div className={tabClasses('metadata')} onClick={() => setActiveTab('metadata')}>Metadata</div>
        <div className={tabClasses('payment')} onClick={() => setActiveTab('payment')}>Payment</div>
        <div className={tabClasses('checklist')} onClick={() => setActiveTab('checklist')}>Checklist</div>
        <div className={tabClasses('audit')} onClick={() => setActiveTab('audit')}>Audit Log</div>
        <div className={tabClasses('report')} onClick={() => setActiveTab('report')}>Inspection</div>
      </div>

      {activeTab === 'metadata' && (
        <div className="space-y-2">
          <p><strong>Buyer:</strong> {escrow?.buyer?.email || 'N/A'}</p>
          <p><strong>Seller:</strong> {escrow?.seller?.email || 'N/A'}</p>
          <p><strong>Status:</strong> {escrow?.status}</p>
          <p><strong>Amount:</strong> ${escrow?.amount?.toLocaleString()}</p>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="space-y-2">
          <p><strong>Method:</strong> {escrow?.method || 'Wire'}</p>
          <p><strong>Deposit Date:</strong> {escrow?.depositDate || 'Pending'}</p>
        </div>
      )}

      {activeTab === 'checklist' && (
        <EscrowConditionChecklist escrowId={escrow._id} conditions={escrow.conditions || []} />
      )}

      {activeTab === 'audit' && (
        <div className="text-sm text-gray-700">
          <ul>
            {(escrow.auditLog || []).map((entry, idx) => (
              <li key={idx} className="mb-1">{entry.timestamp} — {entry.actor}: {entry.action}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'report' && escrow?.reportToken && (
        <div className="mt-4">
          <SharedReportViewer token={escrow.reportToken} />
        </div>
      )}
    </Modal>
  );
};

EscrowTransactionDetailModal.propTypes = {
  escrow: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EscrowTransactionDetailModal;

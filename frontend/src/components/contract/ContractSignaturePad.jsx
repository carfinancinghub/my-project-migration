// File: ContractSignaturePad.js
// Path: frontend/src/components/contract/ContractSignaturePad.js

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Button from '@/components/common/Button';
import axios from 'axios';

const ContractSignaturePad = ({ contractId, onSigned }) => {
  const sigPadRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const clear = () => sigPadRef.current.clear();

  const handleSubmit = async () => {
    if (sigPadRef.current.isEmpty()) {
      return setError('✍️ Please sign before submitting');
    }
    setError(null);
    setSubmitting(true);

    try {
      const dataURL = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/contracts/${contractId}/sign`,
        { signature: dataURL },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSigned(); // Callback for parent to refresh status
    } catch (err) {
      console.error('Signature submission failed:', err);
      setError('❌ Failed to submit signature');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">🖋️ Sign Contract</h2>
      <SignatureCanvas
        ref={sigPadRef}
        penColor="black"
        canvasProps={{ className: 'border rounded w-full h-40' }}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex space-x-3">
        <Button type="button" onClick={clear}>♻️ Clear</Button>
        <Button type="button" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : '✅ Submit Signature'}
        </Button>
      </div>
    </div>
  );
};

export default ContractSignaturePad;

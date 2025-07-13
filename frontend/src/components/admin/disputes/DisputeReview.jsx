// File: DisputeReview.js
// Path: frontend/src/components/admin/disputes/DisputeReview.js

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DisputeReview = () => {
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/disputes`)
      .then((res) => res.json())
      .then(setDisputes)
      .catch((err) => console.error('Failed to load disputes', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>🧾 Review Pending Disputes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {disputes.length === 0 ? (
            <p className="text-gray-500">No disputes to review.</p>
          ) : (
            disputes.map((dispute, idx) => (
              <div key={idx} className="border p-4 rounded bg-gray-50">
                <p><strong>ID:</strong> {dispute._id}</p>
                <p><strong>Buyer:</strong> {dispute.buyerName}</p>
                <p><strong>Seller:</strong> {dispute.sellerName}</p>
                <p><strong>Reason:</strong> {dispute.reason}</p>
                <Button className="mt-2">Review Case</Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DisputeReview;

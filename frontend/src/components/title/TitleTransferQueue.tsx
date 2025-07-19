/**
 * © 2025 CFH, All Rights Reserved
 * File: TitleTransferQueue.tsx
 * Path: frontend/src/components/title/TitleTransferQueue.tsx
 * Purpose: Dashboard component for managing title transfer queue
 * Author: Cod1 Team
 * Date: 2025-07-18 [0815]
 * Version: 1.0.1
 * Version ID: z0x1c2v3b4n5m6l7k8j9h0g1f2d3s4a5
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: z0x1c2v3b4n5m6l7k8j9h0g1f2d3s4a5
 * Save Location: frontend/src/components/title/TitleTransferQueue.tsx
 */

import React, { useEffect, useState, ChangeEvent } from 'react';
import AdminLayout from '@admin/layout/AdminLayout';
import Navbar from '@layout/Navbar';
import Card from '@common/Card';
import Button from '@common/Button';
import Input from '@common/Input';
import LoadingSpinner from '@common/LoadingSpinner';
import { theme } from '@styles/theme';
import { titleQueueSchema } from '@validation/title.validation';
import { getPendingTransfers, completeTransfer } from '@services/title';

interface TitleRequest {
  _id: string;
  vin?: string;
  vehicleId?: string;
  buyer: string;
  seller: string;
  escrowId: string;
  status: string;
}

const TitleTransferQueue: React.FC = () => {
  const [requests, setRequests] = useState<TitleRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<TitleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const data = await getPendingTransfers(token);
        await titleQueueSchema.validateAsync(data);
        setRequests(data);
        setFilteredRequests(data);
      } catch (err: any) {
        console.error('Error fetching title queue:', err);
        setError('❌ Failed to fetch title transfer requests');
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, [token]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setSearchQuery(val);
    const filtered = requests.filter(
      request =>
        (request.vin?.toLowerCase().includes(val) ||
          request.vehicleId?.toLowerCase().includes(val)) ||
        request.buyer.toLowerCase().includes(val) ||
        request.seller.toLowerCase().includes(val)
    );
    setFilteredRequests(filtered);
  };

  const handleComplete = async (id: string) => {
    try {
      await completeTransfer(id, token);
      setRequests(requests.filter(item => item._id !== id));
      setFilteredRequests(filteredRequests.filter(item => item._id !== id));
    } catch (err) {
      console.error(`Failed to complete transfer:`, err);
      alert('Error updating status');
    }
  };

  return (
    <AdminLayout>
      <Navbar />
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">📜 Title Transfer Queue</h2>
        <Input
          type="text"
          placeholder="Search by vehicle ID, buyer, or seller..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/2"
        />
        {loading && <LoadingSpinner />}
        {error && <p className={theme.errorText}>{error}</p>}
        {!loading && !error && filteredRequests.length === 0 && (
          <p className="text-gray-500">No pending title transfer requests.</p>
        )}
        {!loading && !error && filteredRequests.length > 0 && (
          <div className="grid gap-4">
            {filteredRequests.map(job => (
              <Card key={job._id} className="p-4 space-y-2">
                <p>
                  <strong>Vehicle ID:</strong> {job.vin || job.vehicleId}
                </p>
                <p>
                  <strong>Buyer:</strong> {job.buyer}
                </p>
                <p>
                  <strong>Seller:</strong> {job.seller}
                </p>
                <p>
                  <strong>Status:</strong> {job.status}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleComplete(job._id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Complete Transfer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TitleTransferQueue;

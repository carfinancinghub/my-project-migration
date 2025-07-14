/**
 * Test file for auctionController.ts
 * Path: C:\CFH\backend\tests\controllers\auction\auctionController.test.ts
 * Purpose: Unit tests for auction controller functions in the CFH Automotive Ecosystem.
 * Author: Cod1 Team (reviewed by Grok)
 * Date: 2025-07-14 [1642]
 * Version: 1.1.0
 * Crown Certified: Yes
 * Batch ID: Compliance-071425
 * Artifact ID: q5r6s7t8-u9v0-w1x2-y3z4-a5b6c7d8e9f0
 * Save Location: C:\CFH\backend\tests\controllers\auction\auctionController.test.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14 [1642]
 */

import { Request, Response } from 'express';
import { createAuction, getAllAuctions, getAuctionById, deleteAuction } from '@controllers/auction/auctionController'; // Alias import
import Auction from '@models/auction/Auction';

jest.mock('@models/auction/Auction'); // Mock Mongoose model

describe('Auction Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = { body: {}, params: {} };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  it('should create an auction', async () => {
    const mockAuction = { _id: '123', save: jest.fn().mockResolvedValue({ _id: '123' }) };
    (Auction as jest.Mock).mockReturnValue(mockAuction);

    await createAuction(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: { _id: '123' } });
  });

  it('should get all auctions', async () => {
    (Auction.find as jest.Mock).mockResolvedValue([{ _id: '123' }]);

    await getAllAuctions(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, count: 1, data: [{ _id: '123' }] });
  });

  it('should get auction by ID', async () => {
    mockReq.params = { id: '123' };
    (Auction.findById as jest.Mock).mockResolvedValue({ _id: '123' });

    await getAuctionById(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, data: { _id: '123' } });
  });

  it('should delete auction by ID', async () => {
    mockReq.params = { id: '123' };
    (Auction.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '123' });

    await deleteAuction(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, message: 'Auction deleted' });
  });

  it('should handle 404 for get by ID not found', async () => {
    mockReq.params = { id: '123' };
    (Auction.findById as jest.Mock).mockResolvedValue(null);

    await getAuctionById(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(404);
  });
});

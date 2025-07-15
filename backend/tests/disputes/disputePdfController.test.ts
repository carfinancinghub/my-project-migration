/**
 * © 2025 CFH, All Rights Reserved
 * File: disputePdfController.test.ts
 * Path: C:\CFH\backend\tests\disputes\disputePdfController.test.ts
 * Purpose: Unit test for disputePdfController.ts (PDF generation for dispute cases) in the CFH Automotive Ecosystem.
 * Author: CFH QA Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-14 [19:25]
 * Version: 1.1.0
 * Crown Certified: Yes
 * Batch ID: Compliance-071425
 * Artifact ID: a4f2e1c3-d6b7-4e9f-a9c0-f1d2e3b4c5d6
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-14 [19:25]
 */

import { Request, Response } from 'express';
import { generateDisputePdf } from '@controllers/disputes/disputePdfController'; // Alias import
import Dispute from '@models/dispute/Dispute';
import PDFDocument from 'pdfkit';
import logger from '@utils/logger'; // Spy on logger

jest.mock('@models/dispute/Dispute');
jest.spyOn(PDFDocument.prototype, 'pipe').mockReturnValue(PDFDocument.prototype);
jest.spyOn(PDFDocument.prototype, 'end').mockReturnValue(undefined);
jest.spyOn(logger, 'warn'); // Spy on logger.warn
jest.spyOn(logger, 'info'); // Spy on logger.info
jest.spyOn(logger, 'error'); // Spy on logger.error

describe('Dispute PDF Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach() => {
    mockReq = { params: {}, headers: {} };
    mockRes = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach() => {
    jest.restoreAllMocks(); // Restore mocks to avoid contamination
  });

  /**
   * Tests PDF generation for existing dispute.
   */
  it('should generate PDF for existing dispute', async () => {
    mockReq.params = { caseId: '123' };
    (Dispute.findById as jest.Mock).mockResolvedValue({ _id: '123', reason: 'Test', status: 'open' });

    await generateDisputePdf(mockReq as Request, mockRes as Response);
    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Disposition', expect.stringContaining('dispute_123.pdf'));
    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(logger.info).toHaveBeenCalledWith('Dispute PDF generated successfully', expect.any(Object));
  });

  /**
   * Tests 404 if no dispute found.
   */
  it('should return 404 if no dispute found', async () => {
    mockReq.params = { caseId: '123' };
    (Dispute.findById as jest.Mock).mockResolvedValue(null);

    await generateDisputePdf(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Dispute not found' });
    expect(logger.warn).toHaveBeenCalledWith('No dispute found for PDF generation', expect.any(Object));
  });

  /**
   * Tests error during PDF generation.
   */
  it('should handle error in PDF generation', async () => {
    mockReq.params = { caseId: '123' };
    (Dispute.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

    await generateDisputePdf(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error' });
    expect(logger.error).toHaveBeenCalledWith('Failed to generate dispute PDF', expect.any(Object));
  });

  /**
   * Tests correlation ID in logs.
   */
  it('should include correlation ID in logs', async () => {
    mockReq.headers = { 'x-correlation-id': 'test-corr' };
    mockReq.params = { caseId: '123' };
    (Dispute.findById as jest.Mock).mockResolvedValue({ _id: '123' });

    await generateDisputePdf(mockReq as Request, mockRes as Response);
    expect(logger.info).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ correlationId: 'test-corr' }));
  });

  /**
   * Tests premium watermark (stub).
   */
  it('should add premium watermark (stub)', async () => {
    mockReq.params = { caseId: '123' };
    (Dispute.findById as jest.Mock).mockResolvedValue({ _id: '123', tier: 'premium' });

    await generateDisputePdf(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    // Stub test for watermark – expand when implemented
  });
});

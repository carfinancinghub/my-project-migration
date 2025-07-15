/**
 * © 2025 CFH, All Rights Reserved
 * File: app.ts
 * Path: C:\CFH\backend\app.ts
 * Purpose: Entry point for CFH backend app with structured middleware, error handling, and routing in the CFH Automotive Ecosystem.
 * Author: CFH Dev Team (upgraded by Cod1, reviewed by Grok)
 * Date: 2025-07-15 [00:10]
 * Version: 1.1.0
 * Version ID: 32fc9db4-7e29-48f7-9471-1a7d49aa0b98
 * Crown Certified: Yes
 * Batch ID: Compliance-071425
 * Artifact ID: 32fc9db4-7e29-48f7-9471-1a7d49aa0b98
 * Save Location: C:\CFH\backend\app.ts
 * Updated By: Grok (based on Cod1 suggestions)
 * Timestamp: 2025-07-15 [00:10]
 */

/*
 * Future Enhancements (Cod1):
 * - Add IP whitelisting middleware via config for premium (Cod1, 2025-07-15 [00:10]).
 * - Add audit trail middleware for Wow++ request logging (Cod1, 2025-07-15 [00:10]).
 * - Implement rate limiting with express-rate-limit or Redis (Cod1, 2025-07-15 [00:10]).
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import logger from '@utils/logger'; // Alias import
import EscrowRoutes from '@routes/escrow/EscrowRoutes';
import AnalyticsRoutes from '@routes/analytics/analytics.routes';
import BidRoutes from '@routes/analytics/bid';
import AuctionRoutes from '@routes/auctions/auctions';
import UserProfileRoutes from '@routes/user/userProfileRoutes';
import MarketplaceRoutes from '@routes/marketplace/marketplace';
import UserProfile from '@routes/user/userProfile';

const app: Application = express();

app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } })); // HTTP logging
app.use(express.json());

app.use('/api/escrow', EscrowRoutes);
app.use('/api/analytics', AnalyticsRoutes);
app.use('/api/analytics/bid', BidRoutes);
app.use('/api/auctions', AuctionRoutes);
app.use('/api/user', UserProfileRoutes);
app.use('/api/user/profile', UserProfile);
app.use('/api/marketplace', MarketplaceRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', { error: err.message, correlationId: req.headers['x-correlation-id'] });
  res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;

// Premium/Wow++ Note: Add IP whitelisting for premium, audit trail for Wow++ (call @blockchain/auditLog).

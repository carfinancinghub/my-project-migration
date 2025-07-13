// (c) 2025 CFH, All Rights Reserved
// Purpose: Main application entry point
import express from 'express';
import userProfileRoutes from '@routes/user/userProfileRoutes.mjs';
import marketplaceRoutes from '@routes/marketplace/marketplaceRoutes.mjs';
import auctionRoutes from '@routes/auctions/auctions.mjs';
const app = express();
app.use(express.json());
app.use('/api', userProfileRoutes);
app.use('/api', marketplaceRoutes);
app.use('/api', auctionRoutes);
export default app;

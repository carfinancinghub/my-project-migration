import express from 'express';
import EscrowRoutes from '@routes/escrow/EscrowRoutes';
import AnalyticsRoutes from '@routes/analytics/analytics.routes';
import BidRoutes from '@routes/analytics/bid';
import AuctionRoutes from '@routes/auctions/auctions';
import UserProfileRoutes from '@routes/user/userProfileRoutes';
import MarketplaceRoutes from '@routes/marketplace/marketplace';
import UserProfile from '@routes/user/userProfile';

const app = express();

app.use(express.json());
app.use('/api/escrow', EscrowRoutes);
app.use('/api/analytics', AnalyticsRoutes);
app.use('/api/analytics/bid', BidRoutes);
app.use('/api/auctions', AuctionRoutes);
app.use('/api/user', UserProfileRoutes);
app.use('/api/user/profile', UserProfile);
app.use('/api/marketplace', MarketplaceRoutes);

export default app;

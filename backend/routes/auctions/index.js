// File: index.js
// Path: backend/routes/auctions/index.js
// 👑 Cod1 Crown Certified — Auction API Routes

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('@/middleware/authMiddleware');
const {
  getAllActiveAuctions,
  getAuctionById,
  createAuction,
  submitBid,
  closeAuctionIfExpired,
} = require('@/controllers/auction/auctionController');

// Auction Routes
router.get('/', getAllActiveAuctions);
router.get('/:auctionId', getAuctionById);
router.post('/', authenticateUser, createAuction);
router.post('/:auctionId/bid', authenticateUser, submitBid);
router.post('/:auctionId/close', authenticateUser, closeAuctionIfExpired);

module.exports = router;

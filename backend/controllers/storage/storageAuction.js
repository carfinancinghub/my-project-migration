// File: storageAuction.js
// Path: backend/controllers/storageAuction.js

const StorageAuction = require('../models/StorageAuction'); // Assumes model exists

// Create a new storage auction
const createStorageAuction = async (req, res) => {
  try {
    const { carId, durationDays, startingBid } = req.body;
    const createdBy = req.user.id;

    const auction = new StorageAuction({
      carId,
      createdBy,
      durationDays,
      startingBid,
      bids: [],
      status: 'open',
    });

    await auction.save();
    res.status(201).json({ success: true, auction });
  } catch (err) {
    console.error('Create storage auction error:', err);
    res.status(500).json({ error: 'Failed to create storage auction' });
  }
};

// Place a bid by a storage provider
const placeStorageBid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { bidAmount, message } = req.body;
    const userId = req.user.id;

    const auction = await StorageAuction.findById(auctionId);
    if (!auction || auction.status !== 'open') {
      return res.status(404).json({ error: 'Auction not found or closed' });
    }

    const bid = {
      providerId: userId,
      bidAmount,
      message,
      timestamp: new Date(),
    };

    auction.bids.push(bid);
    await auction.save();

    res.status(200).json({ success: true, bid });
  } catch (err) {
    console.error('Place storage bid error:', err);
    res.status(500).json({ error: 'Failed to place bid' });
  }
};

// Close storage auction and select winning bid
const closeStorageAuction = async (req, res) => {
  try {
    const { auctionId, winningProviderId } = req.body;

    const auction = await StorageAuction.findById(auctionId);
    if (!auction || auction.status !== 'open') {
      return res.status(404).json({ error: 'Auction not found or already closed' });
    }

    auction.status = 'closed';
    auction.winningProviderId = winningProviderId;

    await auction.save();
    res.status(200).json({ success: true, auction });
  } catch (err) {
    console.error('Close storage auction error:', err);
    res.status(500).json({ error: 'Failed to close auction' });
  }
};

module.exports = {
  createStorageAuction,
  placeStorageBid,
  closeStorageAuction,
};

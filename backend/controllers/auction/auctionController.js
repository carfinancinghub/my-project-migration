// File: auctionController.js
// Path: backend/controllers/auction/auctionController.js
// 👑 Cod1 Crown Certified — Auction Controller

const Auction = require('@/models/auction/Auction');
const io = require('@/socket');

// Get all active auctions
exports.getAllActiveAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ status: 'open' }).populate('car');
    res.json(auctions);
  } catch (err) {
    console.error('Error fetching auctions:', err);
    res.status(500).json({ error: 'Failed to fetch auctions' });
  }
};

// Get auction by ID
exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.auctionId).populate('car');
    if (!auction) return res.status(404).json({ error: 'Auction not found' });
    res.json(auction);
  } catch (err) {
    console.error('Error fetching auction:', err);
    res.status(500).json({ error: 'Failed to fetch auction' });
  }
};

// Create new auction
exports.createAuction = async (req, res) => {
  try {
    const { car, startingPrice, durationMinutes } = req.body;
    const endsAt = new Date(Date.now() + durationMinutes * 60000);

    const auction = new Auction({
      car,
      startingPrice,
      currentBid: startingPrice,
      bidHistory: [],
      status: 'open',
      endsAt,
    });

    await auction.save();
    res.status(201).json(auction);
  } catch (err) {
    console.error('Error creating auction:', err);
    res.status(500).json({ error: 'Failed to create auction' });
  }
};

// Submit a bid to an auction
exports.submitBid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { amount } = req.body;
    const userId = req.user._id; // Assume JWT middleware populates req.user

    const auction = await Auction.findById(auctionId);
    if (!auction || auction.status !== 'open') {
      return res.status(400).json({ error: 'Auction not available for bidding' });
    }

    // Time-based auto-close
    if (new Date() > auction.endsAt) {
      auction.status = 'closed';
      await auction.save();
      return res.status(400).json({ error: 'Auction has ended' });
    }

    // Enforce minimum bid increment
    const minIncrement = 100;
    if (amount < auction.currentBid + minIncrement) {
      return res.status(400).json({ error: `Bid must be at least $${minIncrement} higher than current bid` });
    }

    auction.currentBid = amount;
    auction.currentBidder = userId;
    auction.bidHistory.push({ bidder: userId, amount, timestamp: new Date() });

    await auction.save();

    io.getIO().emit('bid-update', {
      auctionId: auction._id,
      currentBid: auction.currentBid,
      bidHistory: auction.bidHistory,
    });

    res.json({ success: true, auction });
  } catch (err) {
    console.error('Error submitting bid:', err);
    res.status(500).json({ error: 'Failed to submit bid' });
  }
};

// Manually close an auction (if expired)
exports.closeAuctionIfExpired = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);

    if (!auction) return res.status(404).json({ error: 'Auction not found' });
    if (auction.status === 'closed') return res.status(400).json({ error: 'Auction already closed' });
    if (new Date() < auction.endsAt) return res.status(400).json({ error: 'Auction not yet expired' });

    auction.status = 'closed';
    await auction.save();

    io.getIO().emit('auction-closed', {
      auctionId: auction._id,
      finalBid: auction.currentBid,
    });

    res.json({ message: 'Auction closed', auction });
  } catch (err) {
    console.error('Error closing auction:', err);
    res.status(500).json({ error: 'Failed to close auction' });
  }
};

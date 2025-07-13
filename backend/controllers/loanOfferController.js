// File: loanOfferController.js
// Path: backend/controllers/loanOfferController.js

const LoanOffer = require('../../server/models/LoanOffer');

// Get all offers for an auction
exports.getOffersByAuction = async (req, res) => {
  try {
    const offers = await LoanOffer.find({ auctionId: req.params.auctionId })
      .populate('lenderId', 'name')
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
};

// Lender submits a new offer
exports.createLoanOffer = async (req, res) => {
  try {
    const { auctionId, interestRate, downPaymentRequired, incomeVerificationRequired } = req.body;
    const offer = new LoanOffer({
      auctionId,
      lenderId: req.user._id,
      interestRate,
      downPaymentRequired,
      incomeVerificationRequired,
    });
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create offer' });
  }
};

// Admin or lender updates offer terms
exports.updateLoanOffer = async (req, res) => {
  try {
    const offer = await LoanOffer.findById(req.params.offerId);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    if (req.user.role !== 'admin' && offer.lenderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    Object.assign(offer, req.body);
    await offer.save();
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update offer' });
  }
};

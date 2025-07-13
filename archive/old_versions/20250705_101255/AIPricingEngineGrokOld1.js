// File: AIPricingEngine.js
// Path: backend/utils/AIPricingEngine.js
// Purpose: Dynamic listing pricing with real-time market API integration and AI-based price optimization
// Author: Cod2
// Date: 2025-04-30
// 👑 Cod2 Crown Certified

const axios = require('axios');
const Listing = require('@models/seller/Listing');

const AIPricingEngine = {
  async fetchMarketData(make, model, year) {
    try {
      const response = await axios.get(`https://api.marketprices.ai/pricing`, {
        params: { make, model, year },
      });
      return response.data;
    } catch (err) {
      console.error('Failed to fetch market data:', err.message);
      return null;
    }
  },

  async calculateOptimalPrice(listingId) {
    const listing = await Listing.findById(listingId);
    if (!listing) throw new Error('Listing not found');

    const marketData = await this.fetchMarketData(
      listing.make,
      listing.model,
      listing.year
    );

    if (!marketData) return listing.price;

    const { averagePrice, marketTrendScore } = marketData;
    const aiBoost = marketTrendScore > 0.8 ? 1.05 : 0.97;

    const optimalPrice = parseFloat((averagePrice * aiBoost).toFixed(2));
    return optimalPrice;
  },
};

module.exports = AIPricingEngine;

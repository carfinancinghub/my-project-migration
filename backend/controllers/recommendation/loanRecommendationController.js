// File: loanRecommendationController.js
// Path: backend/controllers/loanRecommendationController.js

const mockOffers = [
  {
    lenderName: 'Capital Auto Finance',
    rate: 5.2,
    term: 60,
    monthlyPayment: 350,
    downPayment: 1000,
  },
  {
    lenderName: 'Prime Lending Group',
    rate: 4.5,
    term: 48,
    monthlyPayment: 420,
    downPayment: 0,
  },
  {
    lenderName: 'Metro Bank Auto',
    rate: 6.0,
    term: 36,
    monthlyPayment: 500,
    downPayment: 2000,
  }
];

const calculateMatchScore = (offer, priority) => {
  switch (priority) {
    case 'lowestRate':
      return 100 - offer.rate * 10;
    case 'lowestPayment':
      return 100 - offer.monthlyPayment / 10;
    case 'noDown':
      return offer.downPayment === 0 ? 100 : 70 - offer.downPayment / 100;
    case 'shortTerm':
      return 100 - offer.term;
    default:
      return 50;
  }
};

const getLoanRecommendations = (req, res) => {
  const { buyerId, priority = 'lowestRate' } = req.query;

  if (!buyerId) {
    return res.status(400).json({ error: 'Missing buyerId' });
  }

  const ranked = mockOffers.map((offer) => ({
    ...offer,
    matchScore: Math.round(calculateMatchScore(offer, priority)),
    aiReasoning: `Prioritized for ${priority.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
  })).sort((a, b) => b.matchScore - a.matchScore);

  return res.json(ranked);
};

module.exports = { getLoanRecommendations };

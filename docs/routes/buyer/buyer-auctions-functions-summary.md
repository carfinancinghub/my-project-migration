## 📘 Buyer Auction Route Functions

### GET /api/buyer/auctions

#### Purpose
Fetch buyer’s auction history, provider bids, and optional analytics and AI-powered recommendations.

#### Inputs
- `buyerId` (query string, required)
- `isPremium` (query boolean, optional)

#### Outputs
```json
{
  "history": [
    {
      "auctionId": "...",
      "carId": "...",
      "status": "...",
      "won": true,
      "availableBids": [
        {
          "providerType": "lender",
          "amount": 12000,
          "interestRate": 6.5,
          "timestamp": "..."
        }
      ]
    }
  ],
  "analytics": {
    "successRate": "40%",
    "averageBidsPerAuction": "2.6"
  },
  "recommendations": [
    {
      "auctionId": "...",
      "recommendedBid": {
        "providerId": "...",
        "reason": "Lowest interest rate"
      }
    }
  ],
  "websocket": "/ws/buyer/{buyerId}/live-bids"
}
Dependencies
@/models/Auction

@services/auction/BidService

@services/ai/BidRecommender

@utils/logger

@utils/validateQueryParams

helmet, express-rate-limit
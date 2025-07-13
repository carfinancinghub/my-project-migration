## AIInsightBuyer.js Functions Summary
- **getBiddingStrategy**: Generates AI-driven bidding strategy for premium buyers.
  - **Inputs**: `userId: string`, `auctionId: string`.
  - **Outputs**: Object with strategy and confidence.
  - **Dependencies**: `services/db`, `services/ai`.
- **getMarketTrends**: Analyzes market trends for premium buyers.
  - **Inputs**: `userId: string`.
  - **Outputs**: Object with trends and top vehicle types.
  - **Dependencies**: `services/db`, `services/ai`.
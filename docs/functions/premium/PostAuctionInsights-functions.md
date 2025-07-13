## PostAuctionInsights.js Functions Summary
- **analyzeAuction**: Analyzes an auction to provide AI-driven insights.
  - **Inputs**: `userId: string`, `auctionId: string`.
  - **Outputs**: Object with bidding trends, performance score, and recommendations.
  - **Dependencies**: `services/db`, `services/ai`.
- **getComparativeAnalysis**: Compares multiple auctions for performance analysis.
  - **Inputs**: `userId: string`, `auctionIds: string[]`.
  - **Outputs**: Object with comparative analysis data.
  - **Dependencies**: `services/db`, `services/ai`.
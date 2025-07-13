## SocialShareHelper.js Functions Summary
- **generateShareLink**: Generates a shareable link for an auction.
  - **Inputs**: `userId: string`, `auctionId: string`.
  - **Outputs**: Object with `shareLink`.
  - **Dependencies**: `services/db`, `services/social`.
- **trackShare**: Tracks a share action and awards loyalty points.
  - **Inputs**: `userId: string`, `auctionId: string`, `platform: string`.
  - **Outputs**: Object with status and points earned.
  - **Dependencies**: `services/db`, `services/social`, `services/premium/LoyaltyRewards`.
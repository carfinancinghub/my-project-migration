## DisputeManager.js Functions Summary
- **createDispute**: Creates a new dispute for an auction.
  - **Inputs**: `officerId: string`, `userId: string`, `auctionId: string`, `reason: string`.
  - **Outputs**: Object with `disputeId` and status.
  - **Dependencies**: `services/db`.
- **resolveDispute**: Resolves an existing dispute with a resolution.
  - **Inputs**: `officerId: string`, `disputeId: string`, `resolution: string`.
  - **Outputs**: Object with `disputeId`, status, and resolution.
  - **Dependencies**: `services/db`.
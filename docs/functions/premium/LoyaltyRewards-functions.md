## LoyaltyRewards.js Functions Summary
- **addPoints**: Adds loyalty points for premium user actions.
  - **Inputs**: `userId: string`, `action: string`, `points: number`.
  - **Outputs**: Object with status and total points.
  - **Dependencies**: `services/db`.
- **redeemReward**: Redeems a reward for premium users using points.
  - **Inputs**: `userId: string`, `rewardType: string`.
  - **Outputs**: Object with status, remaining points, and reward type.
  - **Dependencies**: `services/db`.
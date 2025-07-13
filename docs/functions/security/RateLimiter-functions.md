## RateLimiter.js Functions Summary
- **checkRateLimit**: Checks if a user action is within rate limits.
  - **Inputs**: `userId: string`, `action: string`, `limit: number`, `windowSeconds: number`.
  - **Outputs**: Object with `allowed` status and remaining attempts.
  - **Dependencies**: `services/cache`.
- **resetRateLimit**: Resets the rate limit for a user action.
  - **Inputs**: `userId: string`, `action: string`.
  - **Outputs**: Object with status.
  - **Dependencies**: `services/cache`.
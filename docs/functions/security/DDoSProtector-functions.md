## DDoSProtector.js Functions Summary
- **checkRequestFlood**: Checks if requests from an IP exceed flood limits.
  - **Inputs**: `ipAddress: string`, `limit: number`, `windowSeconds: number`.
  - **Outputs**: Object with `allowed` status and remaining requests.
  - **Dependencies**: `services/cache`.
- **blockIP**: Blocks an IP address for a specified duration.
  - **Inputs**: `ipAddress: string`, `durationSeconds: number`.
  - **Outputs**: Object with status and `ipAddress`.
  - **Dependencies**: `services/cache`.
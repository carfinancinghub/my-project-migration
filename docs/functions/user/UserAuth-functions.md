## UserAuth.js Functions Summary
- **registerUser**: Registers a new user and generates a JWT token.
  - **Inputs**: `email: string`, `password: string`, `role: string`.
  - **Outputs**: Object with `userId` and `token`.
  - **Dependencies**: `services/db`, `jsonwebtoken`, `bcrypt`.
- **loginUser**: Logs in a user and generates a JWT token.
  - **Inputs**: `email: string`, `password: string`.
  - **Outputs**: Object with `userId` and `token`.
  - **Dependencies**: `services/db`, `jsonwebtoken`, `bcrypt`.
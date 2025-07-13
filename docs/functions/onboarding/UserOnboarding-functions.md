## UserOnboarding.js Functions Summary
- **completeProfile**: Completes the user profile during onboarding.
  - **Inputs**: `userId: string`, `profileData: object`.
  - **Outputs**: Object with status.
  - **Dependencies**: `services/db`.
- **getOnboardingStatus**: Retrieves the user's onboarding status.
  - **Inputs**: `userId: string`.
  - **Outputs**: Object with `onboarded` status and profile data.
  - **Dependencies**: `services/db`.
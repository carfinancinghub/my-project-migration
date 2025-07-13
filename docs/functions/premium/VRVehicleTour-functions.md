## VRVehicleTour.js Functions Summary
- **createVRTour**: Creates a VR tour for a vehicle.
  - **Inputs**: `userId: string`, `vehicleId: string`.
  - **Outputs**: Object with `tourId` and `vrTourUrl`.
  - **Dependencies**: `services/db`, `services/vr`.
- **startVRTour**: Starts a VR tour session for a premium user.
  - **Inputs**: `userId: string`, `tourId: string`.
  - **Outputs**: Object with `sessionId` and `vrTourUrl`.
  - **Dependencies**: `services/db`, `services/vr`.
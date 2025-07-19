/**
 * © 2025 CFH, All Rights Reserved
 * File: index.ts
 * Path: C:\cfh\backend\__mocks__\
 * Purpose: Mock Express server for testing
 * Author: CFH Dev Team, Grok
 * Date: 2025-07-18 [1708]
 * Version: 1.0.1
 * Version ID: h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3
 * Crown Certified: Yes
 * Batch ID: Compliance-071825
 * Artifact ID: h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3
 * Save Location: __mocks__/index.ts
 * Updated By: Cod1
 * Timestamp: 2025-07-18 [1708]
 */

/**
 * Side Note: TypeScript Conversion & Enhancements
 * - Typed endpoints, added error mock, exported app for integration/E2E testing.
 * - Suggest using supertest for integration tests.
 */

import express, { Express, Request, Response } from 'express';

const app: Express = express();

// Mock middleware placeholder
// app.use(mockAuthMiddleware);

app.get('/user/profile', (_req: Request, res: Response) =>
  res.status(200).json({ success: true })
);

app.get('/arbitrators', (_req: Request, res: Response) =>
  res.status(200).json({ success: true })
);

app.get('/onboarding', (_req: Request, res: Response) =>
  res.status(200).json({ success: true })
);

// Added: Error endpoint mock
app.get('/error', (_req: Request, res: Response) =>
  res.status(500).json({ success: false })
);

export default app;

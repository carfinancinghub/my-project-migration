/*
File: EstimateRoutesFeatureList.md
Path: C:\CFH\docs\features\EstimateRoutesFeatureList.md
Created: 2025-07-04 11:06 PDT
Author: Mini (AI Assistant)
Version: 1.1
Description: Documentation for Express.js routes managing repair estimate requests with tiered features.
Artifact ID: x9y0z1a2-b3c4-d5e6-f7g8-h9i0j1k2l3m4
Version ID: y1z2a3b4-c5d6-e7f8-g9h0-i1j2k3l4m5n6
*/

# Estimate Routes Feature List

## Overview
This document outlines the finalized API endpoints for managing repair estimates within the CFH Automotive Ecosystem's Body Shop module. These routes support a tiered access model, providing increasing functionality from Free to Wow++ tiers, with integrated Compliance, Quality, and Security (CQS) measures.

**Module Purpose**: Facilitate the submission, management, and processing of vehicle repair estimate requests between users (customers) and body shops.

## Tier Matrix

| Tier      | Features                                                                                                                                                                                                                                                                                                                                                                                           |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Free** | Single-shop estimate requests, basic estimate history view.                                                                                                                                                                                                                                                                                                                                        |
| **Standard**| Shop-side estimate viewing, shop response/quoting, enhanced user history.                                                                                                                                                                                                                                                                                                                        |
| **Premium** | Multi-shop estimate broadcasting, priority queue for requests, lead generation for shops, webhooks for external updates (e.g., insurance claim status), ability to integrate with insurance company APIs.                                                                                                                                                                                        |
| **Wow++** | AI preliminary damage assessment (from photos), automated estimate expiry/reminders, AI-assisted conflict resolution suggestions, automated application of AI-recommended resolutions.                                                                                                                                                                                                                    |

## API Specifications

| Endpoint                               | Method  | Tier      | Description                                                                                             | Request Body (JSON)                                                                                                                                                                                                                                | Success Response (JSON)                                                                                       | Status Codes            | CQS Details                                                                                                                                                                                                                                                                         |
| :------------------------------------- | :------ | :-------- | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ | :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/bodyshop/estimates`                  | `POST`  | Free      | Submit a new single-shop estimate request.                                                              | `{"shopId": "uuid", "userId": "uuid", "vehicleMake": "string", "vehicleModel": "string", "damageDescription": "string", "photos": ["url"]}`                                                                                                              | `{"status": "success", "message": "...", "estimate": {"id": "uuid", "status": "Pending"}}`                  | 201, 400, 500           | <500ms (95%), JWT Auth, Rate Limit (100/hr for customers), Audit Logging                                                                                                                                                                                           |
| `/bodyshop/estimates/user/:userId`     | `GET`   | Free      | Get basic estimate history for a specific user (customer).                                              | None                                                                                                                                                                                                                               | `{"status": "success", "data": [{"id": "uuid", "shopName": "string", "status": "string", ...}]}`             | 200, 403, 500           | <500ms (95%), JWT Auth, Audit Logging                                                                                                                                                                                                                                |
| `/bodyshop/estimates/shop/:shopId`     | `GET`   | Standard  | Get estimate requests for a specific shop.                                                              | None                                                                                                                                                                                                                               | `{"status": "success", "data": [{"id": "uuid", "vehicle": "string", "status": "string", ...}]}`               | 200, 403, 404, 500      | <500ms (95%), JWT Auth, Audit Logging                                                                                                                                                                                                                                |
| `/bodyshop/estimates/:estimateId/respond`| `PUT`   | Standard  | Shop responds to an estimate request (provides quote).                                                  | `{"quotedCost": 1500, "timelineDays": 7, "details": "string"}`                                                                                                                                                                                     | `{"status": "success", "message": "...", "estimate": {"id": "uuid", "status": "Quoted", ...}}`              | 200, 400, 403, 409, 500 | <500ms (95%), JWT Auth, Audit Logging, Conflicts (409) for already quoted                                                                                                                                                                                      |
| `/bodyshop/estimates/broadcast`        | `POST`  | Premium   | Submit estimate request to multiple shops (broadcasting).                                               | `{"userId": "uuid", "vehicleMake": "string", "vehicleModel": "string", "damageDescription": "string", "photos": ["url"], "selectedShopIds": ["uuid", "..."], "videos": ["url"], "insuranceProvider": "string", "policyNumber": "string", "preferredContact": "email"}` | `{"status": "accepted", "message": "...", "estimate": {"id": "uuid", "status": "Broadcasted", ...}}`         | 202, 400, 403, 500      | Priority Queue, Rate Limit (250/hr), Audit Logging                                                                                                                                                                                                                  |
| `/bodyshop/estimates/leads`            | `GET`   | Premium   | Get new estimate leads for a shop (from broadcasts).                                                    | None                                                                                                                                                                                                                               | `{"status": "success", "data": [{"id": "uuid", "vehicle": "string", "damage": "string", "userId": "uuid", "status": "string"}]}` | 200, 403, 500           | Redis Caching (5-min TTL), Audit Logging                                                                                                                                                                                                                            |
| `/bodyshop/estimates/webhook/insurance`| `POST`  | Premium   | Receive real-time insurance claim updates for an estimate.                                              | `{"claimId": "string", "userId": "uuid", "adjusterName": "string", "insuredVehicle": {"make": "string", "model": "string", "vin": "string"}, "damageCode": "string", "preferredShops": ["uuid"]}` | `{"status": "received", "claimLinked": true, "data": {"claimId": "string", "userId": "string", ...}}`       | 200, 400, 403, 500      | <500ms (95%), HTTPS enforced, JWT Auth (for trusted partner webhooks), Rate Limit (50/hr), Audit Logging. Secure incoming data.                                                                                                                             |
| `/bodyshop/estimates/ai-assess`        | `POST`  | Wow++     | Perform AI preliminary damage assessment on estimate photos.                                            | `{"estimateId": "uuid", "damagePhotos": ["url"]}`                                                                                                                                                                                  | `{"status": "success", "message": "...", "data": {"summary": "string", "estimatedCost": 3000, "confidence": 0.9}}` | 200, 400, 403, 500      | <500ms (95%), JWT Auth, Secure Data (encryption/sanitization), Rollback on Failed Assessments.                                                                                                                                                                     |
| `/bodyshop/estimates/:estimateId/set-expiry`| `PATCH` | Wow++     | Set an automated expiry date for an estimate, triggering reminders.                                     | `{"expiresAt": "2025-07-10T00:00:00Z"}`                                                                                                                                                                                             | `{"status": "updated", "estimateId": "uuid", "expiresAt": "string"}`                                          | 200, 400, 403, 500      | <500ms (95%), JWT Auth, Audit Logging. Integration with automated notification system.                                                                                                                                                                             |
| `/bodyshop/estimates/reminders/pending`| `GET`   | Wow++     | Get a list of pending expiry reminders for shops/users.                                                 | None                                                                                                                                                                                                                               | `{"status": "success", "data": [{"estimateId": "uuid", "expiresAt": "string", "reminderType": "initial_warning"}]}` | 200, 403, 500           | <500ms (95%), Redis Caching (5-min TTL), Audit Logging. Optimized for fast retrieval.                                                                                                                                                                               |
| `/bodyshop/estimates/:estimateId/resolve-conflict-suggestions`| `GET`   | Wow++     | Get AI-driven suggestions for resolving conflicts related to a specific estimate (e.g., price disputes).| None                                                                                                                                                                                                                               | `{"status": "success", "data": [{"suggestion": "string", "confidence": "number", "type": "renegotiation"}]}` | 200, 400, 403, 500      | <500ms (95%), JWT Auth, Audit Logging. Secure AI inference.                                                                                                                                                                                                         |
| `/bodyshop/estimates/:estimateId/resolve-with-ai`| `POST`  | Wow++     | Apply an AI-recommended resolution to an estimate conflict.                                             | `{"resolutionId": "uuid", "notes": "string", "optionSelected": "string"}`                                                                                                                                                          | `{"status": "success", "message": "Resolution applied.", "estimateId": "uuid"}`                               | 200, 400, 403, 500      | <500ms (95%), JWT Auth, Secure Data Handling, Audit Logging. Rollback on Transactional Failure.                                                                                                                                                                   |

## Required Headers

| Header           | Description                                        | Example                 |
| :--------------- | :------------------------------------------------- | :---------------------- |
| `Authorization`  | JWT token for user authentication.                 | `Bearer your_jwt_token` |
| `Content-Type`   | `application/json` for `POST`/`PUT`/`PATCH` requests.| `application/json`      |
| `X-Forwarded-For`| (Optional, for rate limiting) Client IP address.   | `192.0.2.1`             |
| `x-mock-user-tier`| (For local testing only) Simulates user tier.     | `premium`               |

## Example Responses

### `POST /bodyshop/estimates/webhook/insurance` (Premium Tier)
```json
{
  "status": "received",
  "claimLinked": true,
  "data": {
    "claimId": "claim123-abc-456",
    "userId": "u1e2f3g4-h5i6-7890-1234-567890abcdef",
    "adjusterName": "Jane Smith",
    "insuredVehicle": {
      "make": "Toyota",
      "model": "Camry",
      "vin": "1HGCM82633A123456"
    },
    "damageCode": "D102 - Front Bumper Damage",
    "claimStatus": "Approved"
  }
}
PATCH /bodyshop/estimates/:estimateId/set-expiry (Wow++ Tier)
JSON

{
  "status": "updated",
  "estimateId": "estWow1",
  "message": "Estimate expiry set successfully.",
  "expiresAt": "2025-07-10T00:00:00Z"
}
GET /bodyshop/estimates/reminders/pending (Wow++ Tier)
JSON

{
  "status": "success",
  "data": [
    {
      "estimateId": "estRem1",
      "expiresAt": "2025-07-05T14:00:00Z",
      "reminderType": "initial_warning",
      "shopId": "s1a2b3c4-d5e6-7890-1234-567890abcdef"
    },
    {
      "estimateId": "estRem2",
      "expiresAt": "2025-07-04T18:00:00Z",
      "reminderType": "final_notice",
      "shopId": "s2f3g4h5-i6j7-890a-bcde-f12345678901"
    }
  ]
}
GET /bodyshop/estimates/:estimateId/resolve-conflict-suggestions (Wow++ Tier)
JSON

{
  "status": "success",
  "data": [
    {
      "suggestion": "Suggest renegotiating quoted cost with shop, target a 5% reduction based on market averages for similar damage.",
      "confidence": 0.85,
      "type": "renegotiation"
    },
    {
      "suggestion": "Recommend escalating to an independent insurance mediator for a neutral assessment.",
      "confidence": 0.72,
      "type": "mediation"
    },
    {
      "suggestion": "Propose splitting the difference on parts cost with the customer.",
      "confidence": 0.65,
      "type": "compromise"
    }
  ]
}
POST /bodyshop/estimates/:estimateId/resolve-with-ai (Wow++ Tier)
JSON

{
  "status": "success",
  "message": "AI-recommended resolution applied to estimate. Details will be updated shortly.",
  "estimateId": "estConf1",
  "appliedResolutionType": "renegotiation_proposal",
  "aiActionTimestamp": "2025-07-04T10:50:00Z"
}
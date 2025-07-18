<!--
© 2025 CFH, All Rights Reserved
File: Bid.md
Path: C:\CFH\docs\backend\Bid.md
Purpose: Documentation for the Bid Mongoose model in the CFH Automotive Ecosystem
Author: CFH Dev Team, Cod1 (summary by ChatGPT)
Date: 2025-07-18 [0815]
Version: 1.0.1
Batch ID: Compliance-071825
Artifact ID: i9j0k1l2-m3n4-5678-9012-345678901234
Crown Certified: Yes
Save Location: C:\CFH\docs\backend\Bid.md
-->

# Bid.ts – Model Documentation

## Purpose
Documents the Bid model schema, fields, validation logic, and hooks for use with Mongoose in CFH backend.

## Model File Location
- `C:\CFH\backend\models\Bid.ts`

## Main Schema Fields

- `lender`: ObjectId (User, required, indexed)
- `auction`: ObjectId (Auction, required, indexed)
- `amount`: Number (required, min 0, validated by pre-save)
- `status`: Enum ['pending', 'accepted', 'rejected'] (default: 'pending')
- `createdAt`: Date (default: Date.now, auto via timestamps)

## Pre-Save Hook
- Ensures amount is positive. Throws if not.

## Example Usage

```typescript
import Bid from '@models/Bid';

const bid = new Bid({
  lender: 'userId123',
  auction: 'auctionId456',
  amount: 15000,
});
await bid.save();
Learning Section: Why Model Docs?
Purpose: Clarifies schema logic for other devs and future migrations.

Validation: Shows where custom validation happens (e.g., amount).

Extensions: Easy to update docs if fields/logic change, e.g., adding bid comments or currency.

Suggestions & Improvements
Move validation logic to @validation/bid.validation for DRY schema.

Add mongoose-unique-validator if required fields expand.

Document model usage in test plans for seamless integration.

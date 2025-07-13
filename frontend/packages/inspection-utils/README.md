/*
 * File: README.md
 * Path: C:\\CFH\\frontend\\packages\\inspection-utils\\README.md
 * Purpose: Usage guide and build instructions for inspection-utils package
 * Author: Cod1 Team
 * Crown Certified: Yes
 * Batch ID: Inspection-061325
 */

# @cfh/inspection-utils

Shared utility functions for inspection photo processing in CFH Ecosystem.

## Installation
```bash
pnpm install @cfh/inspection-utils
```

## Usage
```ts
import { runBlurDetection } from '@cfh/inspection-utils';
const isNotBlurry = await runBlurDetection(file);
```

## Build
```bash
pnpm run build
```

## Test
```bash
pnpm run test
```

## Features
- ✅ TensorFlow blur detection via BlazeFace
- ✅ Strict typed TS declarations
- ✅ Jest + ts-jest config
- ✅ Alias: `@cfh/inspection-utils`

---
Batch ID: `Inspection-061325`

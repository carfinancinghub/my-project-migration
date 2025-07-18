<!--
 * © 2025 CFH, All Rights Reserved
 * File: AIInsights.md
 * Path: C:\cfh\docs\functions\seller\AIInsights.md
 * Purpose: Documentation/spec/test plan for AIInsights.tsx (AI-generated insights component)
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-17 [1141]
 * Version: 1.0.1
 * Crown Certified: Yes
 * Related File: frontend/src/components/AIInsights.tsx
 * Related Test: frontend/src/components/__tests__/AIInsights.test.tsx
-->

# AIInsights

## Purpose
Displays AI-generated insights related to a user's vehicle listings (e.g., price trends, market demand, etc.), supporting seller intelligence in the CFH platform.

## Location
`frontend/src/components/AIInsights.tsx`

## Main Features
- Fetches and displays a list of insights, each with a title, description, and confidence score.
- Automatic API call on mount to retrieve insights.
- Displays errors and handles loading state for smooth user experience.

## Insight Data Structure

```ts
interface Insight {
  _id: string;
  title: string;
  description: string;
  confidence: number;
}
Usage Example
tsx
Copy
Edit
import AIInsights from '@components/AIInsights';

<AIInsights />
Test Coverage
Test file: AIInsights.test.tsx

Scenarios tested:

Rendering with returned insights

No insights returned

API error handling/logging

Accessibility
Semantic markup for headings and containers.

Presents dynamic lists accessibly.

Meets WCAG 2.1 AA—test with jest-axe recommended.

Upgrade & Extension Notes
Move API logic to a dedicated @services/ai module.

Add advanced error UI (not just console log).

Add filters or search for insights (Premium/Wow++ tier?).

Provide explanations for confidence scores (Wow++ feature).

Add Storybook entry and advanced a11y testing.

Version/Changelog
v1.0.1 (2025-07-17): Initial Crown Certified doc.

LEARNING SECTION
Why do this?

Keeping this doc with your code means any team member can onboard, audit, or extend the AI insights feature quickly.

Documenting data structures, usage, and tests prevents “tribal knowledge” and supports future refactor with confidence.

Upgrade notes and tiered feature ideas help track tech debt and monetization options.

By referencing the actual test file, you encourage real test coverage and easy audit of what is (and isn’t) tested.

Keep these docs up to date as features or tests change for long-term maintainability and value!

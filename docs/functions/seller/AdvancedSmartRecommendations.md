<!--
 * © 2025 CFH, All Rights Reserved
 * File: AdvancedSmartRecommendations.md
 * Path: C:\cfh\docs\functions\seller\AdvancedSmartRecommendations.md
 * Purpose: Documentation/spec/test plan for AdvancedSmartRecommendations.tsx (AI-driven loan recommendations component)
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-17 [1143]
 * Version: 1.0.1
 * Crown Certified: Yes
 * Related File: frontend/src/components/recommendations/AdvancedSmartRecommendations.tsx
 * Related Test: frontend/src/components/recommendations/__tests__/AdvancedSmartRecommendations.test.tsx
-->

# AdvancedSmartRecommendations

## Purpose
Provides buyers with advanced, AI-driven loan recommendations, supporting prioritization, match scoring, and export for in-depth comparison.

## Location
`frontend/src/components/recommendations/AdvancedSmartRecommendations.tsx`

## Main Features
- Fetches personalized loan recommendations from backend AI.
- Lets user choose recommendation priority (lowest rate, lowest payment, etc.).
- Displays lender, rates, terms, monthly payment, down payment, and AI-calculated match score.
- **Premium:** Export recommendations to CSV.
- **Wow++:** (If available) View detailed AI reasoning for each loan match.

## Props

| Prop    | Type        | Description                   |
|---------|-------------|------------------------------|
| buyerId | `string`    | ID of the buyer making the request |

## Recommendation Structure

```ts
interface Recommendation {
  lenderName: string;
  rate: number;
  term: number;
  monthlyPayment: number;
  downPayment: number;
  matchScore: number;
  aiReasoning?: string; // (Wow++ feature)
}
Usage Example
tsx
Copy
Edit
<AdvancedSmartRecommendations buyerId="user-abc123" />
Tiered Logic
Free: View and prioritize AI loan recommendations.

Premium: Export recommendations as CSV file.

Wow++: View detailed AI reasoning/justification per match (expandable details).

Test Coverage
Test file: AdvancedSmartRecommendations.test.tsx

Test scenarios covered:

Fetch and render recommendations

Priority filter functionality

Export CSV

AI reasoning display (Wow++)

Error and loading handling

Accessibility
Semantic headings and controls for screen readers.

Accessible buttons, dropdowns, and feedback.

Meets WCAG 2.1 AA (verify with jest-axe/RTL).

Upgrade & Extension Notes
Move API and export logic to @services/recommendations.

Add Zod validation for inputs and API responses.

Consider more granular prioritization (e.g., rate + term).

Integrate with global notifications for export/download success.

Add Storybook demo for UX review.

Version/Changelog
v1.0.1 (2025-07-17): Initial Crown Certified doc.

LEARNING SECTION
Why this structure?

Keeps all critical info for extending, auditing, and testing the recommendation engine in one place.

Explicit mapping of tiered logic prevents accidental feature leaks or compliance gaps.

Data structure documentation avoids confusion and speeds up test writing.

Upgrade/extension notes help you track tech debt and future roadmap ideas.

Use this structure for all feature docs—makes future onboarding and upgrades smooth and risk-free!

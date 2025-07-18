<!--
 * © 2025 CFH, All Rights Reserved
 * File: AIRecommendations.md
 * Path: C:\cfh\docs\functions\seller\AIRecommendations.md
 * Purpose: Documentation/spec/test plan for AIRecommendations.tsx (AI-powered recommendations component)
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-17 [1146]
 * Version: 1.0.1
 * Crown Certified: Yes
 * Related File: frontend/src/components/AIRecommendations.tsx
 * Related Test: frontend/src/components/__tests__/AIRecommendations.test.tsx
-->

# AIRecommendations

## Purpose
Displays AI-generated recommendations (e.g., best value, low mileage, market highlights) to help sellers maximize vehicle listing success.

## Location
`frontend/src/components/AIRecommendations.tsx`

## Main Features
- Fetches recommendations from backend AI service and displays each with title, description, and confidence score.
- Handles API loading, error, and empty-state scenarios for smooth user experience.

## Recommendation Data Structure

```ts
interface Recommendation {
  _id: string;
  title: string;
  description: string;
  confidence: number;
}
Usage Example
tsx
Copy
Edit
import AIRecommendations from '@components/AIRecommendations';

<AIRecommendations />
Test Coverage
Test file: AIRecommendations.test.tsx

Scenarios covered:

Renders recommendations from API

Handles empty API responses

Logs error if fetch fails

Accessibility
Accessible list rendering for screen readers.

Semantic headings and containers.

Meets WCAG 2.1 AA (validate with jest-axe or similar tool).

Upgrade & Extension Notes
Move API logic to @services/ai for separation of concerns.

Add more advanced error UI and user feedback.

Premium/Wow++: Could support filtering, personalized recommendations, or explanations.

Add Storybook entry and further accessibility testing.

Version/Changelog
v1.0.1 (2025-07-17): Initial Crown Certified doc.

LEARNING SECTION
Why this structure?

Clarifies data contract, expected behavior, and test scenarios for devs and future maintainers.

Keeps upgrade options and tech debt visible so nothing is forgotten.

Explicit file/test references and clear location help with searchability and onboarding.

Accessibility notes future-proof the UI for all users and compliance needs.

Keep this pattern for all similar UI or API features to ensure long-term maintainability and scale!

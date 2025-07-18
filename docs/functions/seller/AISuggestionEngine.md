<!--
 * © 2025 CFH, All Rights Reserved
 * File: AISuggestionEngine.md
 * Path: C:\cfh\docs\functions\seller\AISuggestionEngine.md
 * Purpose: Documentation/spec/test plan for AISuggestionEngine.tsx (AI listing suggestion component)
 * Author: CFH Dev Team, Cod1
 * Date: 2025-07-17 [1139]
 * Version: 1.0.1
 * Crown Certified: Yes
 * Related File: frontend/src/components/seller/AISuggestionEngine.tsx
 * Related Test: frontend/src/components/seller/__tests__/AISuggestionEngine.test.tsx
-->
# AISuggestionEngine

## Purpose
Provides AI-powered suggestions to help sellers improve car listing titles, descriptions, and tags in the CFH ecosystem.

## Location
`frontend/src/components/seller/AISuggestionEngine.tsx`

## Main Features
- Fetches AI-generated suggestions for title, description, and tags.
- Loading, error handling, and user feedback for smooth UX.
- **Tiered feature control:** 
  - Free: Fetch suggestions
  - Premium: Apply all suggestions with one click
  - Wow++: (Planned) Access competitor-based or AI-rewritten listings

## Props

| Prop    | Type                                                   | Description                           |
|---------|--------------------------------------------------------|---------------------------------------|
| form    | `FormData`                                             | Current listing values                |
| setForm | `React.Dispatch<React.SetStateAction<FormData>>`       | Updates form state                    |

**FormData structure:**
```ts
{
  title: string;
  description: string;
  tags: string[];
}
Usage Example
tsx
Copy
Edit
<AISuggestionEngine form={form} setForm={setForm} />
Tiered Logic
Free: User can request AI suggestions for listing improvement.

Premium: User can apply suggestions with one click.

Wow++: (Planned) User can access competitor-informed AI or advanced rewriting.

Test Coverage
Test file: AISuggestionEngine.test.tsx

Test scenarios covered:

Component renders

API integration and UI update

Not-logged-in user warning

Apply suggestions logic

API error handling

Accessibility
Semantic headings and buttons for assistive tech.

Loading and error feedback provided visually and programmatically.

Meets WCAG 2.1 AA (validate with jest-axe or similar tool).

Upgrade & Extension Notes
Future: Move API logic to @services/ai.

Add strict Zod validation for FormData.

Add Storybook entry and advanced UI accessibility testing.

Version/Changelog
v1.0.1 (2025-07-17): Initial Crown Certified doc.

LEARNING SECTION
Why do this?

This doc makes it trivial to understand, test, and safely change or extend this component.

Referencing the test file ensures you always know which features are covered—and which aren’t.

Explicit tiered logic mapping keeps features compliant with your business model.

Accessibility and upgrade notes help you avoid “forgotten” tech debt or compliance issues.

This pattern, once adopted, will make onboarding, audits, and scaling easier for your whole team.

Keep this structure for all high-value files for clarity, quality, and future-proofing!

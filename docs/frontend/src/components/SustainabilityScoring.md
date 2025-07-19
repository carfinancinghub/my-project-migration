<!--
File: SustainabilityScoring.md
Path: docs/frontend/src/components/SustainabilityScoring.md
Purpose: Documentation for the SustainabilityScoring React component
Author: Cod1 Team
Date: 2025-07-18 [0815]
Version: 1.0.1
Crown Certified: Yes
Batch ID: Compliance-071825
Artifact ID: r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9
Save Location: docs/frontend/src/components/SustainabilityScoring.md
-->

# SustainabilityScoring Component Documentation

## Overview
`SustainabilityScoring.tsx` displays sustainability scores for vehicles, helping users compare options based on environmental impact.

## Location
- Code: `frontend/src/components/SustainabilityScoring.tsx`
- Docs: `docs/frontend/src/components/SustainabilityScoring.md`

## Features

| Feature         | Description                                       |
|-----------------|---------------------------------------------------|
| Score grid      | Shows sustainability score for each vehicle       |
| Details field   | Presents supporting details/explanations          |
| Loading state   | Shows loading spinner during fetch                |
| Error handling  | Displays clear error messages on failure          |
| Validation      | Uses `@validation/sustainability.validation`      |

## Usage Example

```tsx
<SustainabilityScoring />
Improvements by Tier
Free: View own vehicle sustainability score.

Premium: Compare up to 5 vehicles, download detailed reports.

Wow++: AI-based recommendations for greener alternatives, auto-notification on improved scores.

Related Files
frontend/src/components/SustainabilityScoring.tsx

@validation/sustainability.validation

@services/sustainability

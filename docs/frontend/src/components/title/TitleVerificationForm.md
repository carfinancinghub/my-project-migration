<!--
File: TitleVerificationForm.md
Path: docs/frontend/src/components/title/TitleVerificationForm.md
Purpose: Documentation for the TitleVerificationForm React component
Author: Cod1 Team
Date: 2025-07-18 [0815]
Version: 1.0.1
Crown Certified: Yes
Batch ID: Compliance-071825
Artifact ID: 3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k
Save Location: docs/frontend/src/components/title/TitleVerificationForm.md
-->

# TitleVerificationForm Component Documentation

## Overview
`TitleVerificationForm.tsx` provides a secure form for title agents to verify and update the status of title transfer jobs, including support for status updates and notes.

## Location
- Code: `frontend/src/components/title/TitleVerificationForm.tsx`
- Docs: `docs/frontend/src/components/title/TitleVerificationForm.md`

## Features
| Feature                    | Description                                                     |
|----------------------------|-----------------------------------------------------------------|
| Status dropdown            | Choose between Pending, Verified, or Rejected                   |
| Notes field                | Optionally provide context or clarification                     |
| Loading state              | Shows spinner during async operation                            |
| Error handling             | Inline error message and ARIA compliance                        |
| Validation                 | Uses `@validation/title.validation` for status and notes        |
| Secure token               | Fetches auth token (placeholder for context)                    |
| On-complete callback       | Triggers parent action after successful verification            |

## Usage Example
```tsx
<TitleVerificationForm job={jobData} onComplete={() => refetchJobs()} />
Props
Prop	Type	Required	Description
job	Object	Yes	Contains _id, status, notes
onComplete	Func	Yes	Callback fired when update is successful

Improvements by Tier
Free: Basic status change and notes.

Premium: Change history log, enhanced error analytics, and guided status selection.

Wow++: AI-suggested status updates, e-signature, and risk scoring for flagged transfers.

Related Files
frontend/src/components/title/TitleVerificationForm.tsx

@validation/title.validation

@services/title


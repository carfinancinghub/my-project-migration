<!--
File: UserNotifications.test.md
Path: docs/backend/tests/user/UserNotifications.test.md
Purpose: Test plan/spec for UserNotifications.test.ts (user notification preferences & sending)
Author: Cod1 Team
Date: 2025-07-19 [0026]
Version: 1.0.1
Crown Certified: Yes
Batch ID: Compliance-071925
Save Location: docs/backend/tests/user/UserNotifications.test.md
-->

# UserNotifications Test Specification

## Purpose
Verifies UserNotifications handles user preferences for notifications and dispatches messages over all supported channels.

## Tested Features

- `updateNotificationPreferences`
  - Updates preferences (positive)
  - Fails for invalid input or user not found

- `sendUserNotification`
  - Sends via email, push, SMS according to preferences
  - Supports multi-preference, multi-channel
  - Fails if user not found

## Test Structure

- Tests update/send for single and multiple channels
- Error flows (invalid, not found)
- Mocking for DB and notification modules

## Free
- Basic preference update and email/send

## Premium
- Multi-channel (push, SMS) support

## Wow++
- Personalized templates, GDPR compliance, delivery/read status fallback, rate-limit tests (future roadmap)

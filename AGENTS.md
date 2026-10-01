# AGENTS.md

## Project goal

Build an Android voice-assistant companion that lets ChatGPT create and manage reminders while Android remains responsible for firing the actual alarms and notifications.

## Source of truth for architecture

The intended high-level flow is:

**ChatGPT → Cloudflare → Android app → Android-native alarm/notification**

Supabase is an optional persistence/synchronization layer.

## Agent responsibilities

When implementing this project:

1. Preserve the architecture above unless there is a documented technical reason to change it.
2. Do not attempt to make Cloudflare directly act as the Android alarm mechanism.
3. Keep device-level scheduling inside the Android application.
4. Treat Cloudflare as the authenticated API/bridge.
5. Use Supabase for durable reminder state when persistence is needed.
6. Never place privileged API secrets in the Android client.
7. Make reminder operations idempotent whenever practical.
8. Use stable reminder IDs across ChatGPT, backend, and Android.
9. Account for Android notification/alarm permissions, app restarts, device reboots, offline periods, and duplicate synchronization.
10. Prefer small, explicit API contracts over loosely structured agent-to-app communication.

## Core operations

The first implementation should support:

- Create reminder
- List reminders
- Update reminder
- Cancel reminder
- Synchronize reminder state

A reminder should contain, at minimum:

- stable ID
- title
- trigger time
- timezone
- type
- status

## Security

- Authenticate every backend request.
- Validate all reminder payloads server-side.
- Keep backend credentials and service-role keys out of the Android application.
- Do not trust timestamps, IDs, or status transitions from an untrusted client without validation.
- Log enough metadata to debug synchronization without unnecessarily storing sensitive user content.

## Reliability

The Android client should be designed so a reminder can survive:

- app process termination
- app restart
- network loss
- backend retry
- device reboot where supported by the chosen Android scheduling mechanism

Avoid duplicate alarms when the same reminder is synchronized more than once.

## Development order

1. Define the data model and API contract.
2. Build the Cloudflare API.
3. Add persistence/synchronization with Supabase if required.
4. Build Android authentication and sync.
5. Implement Android-native scheduling.
6. Implement reminder CRUD and cancellation.
7. Add ChatGPT/agent integration.
8. Test failure and recovery cases.

## Important constraint

ChatGPT should express the user's intent and request the backend operation. The Android application is the final authority for scheduling the device alarm.

Before adding unrelated features, keep the first milestone focused on reliable voice-created reminders.

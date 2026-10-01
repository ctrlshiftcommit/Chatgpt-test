# AGENTS.md

## Project goal

Build an Android voice-assistant companion that lets ChatGPT create and manage reminders while Android remains responsible for firing the actual alarms and notifications.

## Architecture

```text
ChatGPT
   │
   ▼
Cloudflare API
   │
   ├──────► Supabase
   │         persistence / sync
   │
   ▼
Android App
   │
   ▼
Android-native Alarm / Notification
```

**Core rule: Cloudflare is the bridge; Android is the alarm authority.**

## Agent responsibilities

When implementing this project:

1. Preserve the architecture above unless there is a documented technical reason to change it.
2. Do not make Cloudflare the device alarm mechanism.
3. Keep device-level scheduling inside the Android application.
4. Treat Cloudflare as the authenticated API/bridge.
5. Use Supabase for durable reminder state when persistence is needed.
6. Never place privileged API secrets in the Android client.
7. Make reminder operations idempotent whenever practical.
8. Use stable reminder IDs across ChatGPT, backend, and Android.
9. Account for permissions, app restarts, device reboots, offline periods, retries, and duplicate synchronization.
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
- Validate reminder payloads server-side.
- Keep backend credentials and service-role keys out of the Android application.
- Do not trust timestamps, IDs, or status transitions from an untrusted client without validation.
- Log enough metadata to debug synchronization without unnecessarily storing sensitive user content.

## Reliability

The Android client should be designed so a reminder can survive:

```text
app killed ────────────┐
app restarted ─────────┤
network offline ───────┤
backend retry ─────────┼──► reliable reminder state
duplicate sync ────────┤
device reboot ─────────┤
permissions denied ─────┘
```

Avoid duplicate alarms when the same reminder is synchronized more than once.

## Development order

```text
1. Data model + API contract
          ↓
2. Cloudflare API
          ↓
3. Supabase persistence/sync
          ↓
4. Android auth + sync
          ↓
5. Android-native scheduling
          ↓
6. Reminder CRUD + cancellation
          ↓
7. ChatGPT / agent integration
          ↓
8. Failure + recovery testing
```

## Important constraint

ChatGPT should express the user's intent and request the backend operation. The Android application is the final authority for scheduling the device alarm.

Before adding unrelated features, keep the first milestone focused on reliable voice-created reminders.


## Required Android build skill

Before implementing or repairing the Android application, read and follow the repository's **Build Android Apps** skill:

**[Build Android Apps — Skills/build-android-apps/SKILL.md](https://github.com/ctrlshiftcommit/Skills/blob/main/build-android-apps/SKILL.md)**

The skill is the detailed implementation and verification guide for this project. Use it for native Android architecture, Gradle/Kotlin setup, Compose/XML UI, permissions, persistence, background work, alarms/notifications, device testing, and release builds.

```text
AGENTS.md
    │
    ├── project-specific architecture + constraints
    │
    └── Build Android Apps skill
              │
              ▼
       detailed Android
       implementation + QA
```

When the skill and this file overlap, preserve the project-specific constraints in this file while using the skill for the detailed Android implementation workflow.

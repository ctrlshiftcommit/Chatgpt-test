# Personal Assistant Android

A planned Android voice-assistant app that connects ChatGPT to Android-native reminders and alarms through a small backend layer.

## Architecture

```text
┌──────────────────────┐
│       YOU            │
│  "Remind me in 2h"   │
└──────────┬───────────┘
           │ natural language
           ▼
┌──────────────────────┐
│       ChatGPT        │
│ intent → structured  │
│ reminder request     │
└──────────┬───────────┘
           │ authenticated API request
           ▼
┌──────────────────────┐
│   Cloudflare API     │
│ auth • validation    │
│ routing • sync       │
└───────┬───────┬──────┘
        │       │
        │       └──────────────┐
        ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│     Supabase     │   │   Android App    │
│ persistence      │◄──┤ sync + local DB  │
│ reminder state   │   │                  │
└──────────────────┘   └────────┬─────────┘
                                │
                                │ Android-native
                                │ scheduling
                                ▼
                       ┌──────────────────┐
                       │  ALARM /         │
                       │  NOTIFICATION    │
                       └──────────────────┘
```

### The key rule

**Cloudflare does not ring the phone. Android does.**

Cloudflare is the secure bridge between ChatGPT and the Android application. Supabase can provide durable reminder state and synchronization.

### Responsibilities

| Component | Responsibility |
|---|---|
| **ChatGPT** | Understand natural language and produce structured reminder intent |
| **Cloudflare** | Secure API, authentication, validation, routing, synchronization |
| **Supabase** | Optional durable reminder/device state |
| **Android** | Sync reminders and schedule the actual device alarm/notification |
| **Android OS** | Ultimately fires the scheduled alarm/notification |

## Example flow

```text
User
  │
  │ "Remind me in two hours to start studying."
  ▼
ChatGPT
  │
  │ { title, trigger_at, timezone, ... }
  ▼
Cloudflare
  │
  ├──► validate + authenticate
  │
  └──► persist/sync ──► Supabase
  │
  ▼
Android App
  │
  │ schedule locally
  ▼
Android Alarm / Notification
  │
  ▼
"Time to start studying."
```

## Design principles

- Android owns device-level alarms and notifications.
- Cloudflare is the communication/security layer, not the alarm clock.
- Keep the API small, explicit, authenticated, and easy for an AI agent to use.
- Make reminder creation idempotent so retries do not create duplicate alarms.
- Store stable reminder IDs across ChatGPT, backend, and Android.
- Design for offline synchronization and Android process/app restarts.
- Keep secrets and privileged credentials out of the Android client.
- Start with reminders/alarms; add more assistant actions later.

## Initial implementation phases

```text
PHASE 1   Data model + API contract
   │
   ▼
PHASE 2   Cloudflare API
   │
   ▼
PHASE 3   Supabase persistence/sync
   │
   ▼
PHASE 4   Android auth + synchronization
   │
   ▼
PHASE 5   Android-native alarm scheduling
   │
   ▼
PHASE 6   Reminder CRUD + cancellation
   │
   ▼
PHASE 7   ChatGPT / agent integration
   │
   ▼
PHASE 8   Reliability + failure testing
```

## Reliability cases to test

```text
                         ┌─ app killed
                         ├─ app restarted
                         ├─ network offline
Reminder created ────────┼─ backend retry
                         ├─ duplicate sync
                         ├─ device reboot
                         └─ permissions denied
                                  │
                                  ▼
                       No duplicate / lost reminder
```

## Example reminder payload

```json
{
  "id": "reminder_123",
  "title": "Start studying",
  "trigger_at": "2026-10-01T17:55:00+05:30",
  "timezone": "Asia/Kolkata",
  "type": "alarm",
  "status": "scheduled"
}
```

## First milestone

Get one complete path working reliably:

```text
Voice request
    ↓
ChatGPT
    ↓
Cloudflare
    ↓
Android
    ↓
Local alarm
    ↓
Reminder fires
```

Only after this path works should additional assistant capabilities be added.

This repository documents the architecture and implementation plan.
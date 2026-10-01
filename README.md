# Personal Assistant Android

A planned Android voice-assistant app that connects ChatGPT to Android-native reminders and alarms through a small backend layer.

## Architecture

The core idea is:

**ChatGPT → Cloudflare → Android app → Android alarm/notification**

Supabase can be used as persistent storage where useful.

### Responsibilities

- **ChatGPT**
  - Understand natural-language requests such as: "Remind me in two hours to start studying."
  - Convert the request into structured reminder data.
  - Send the structured request to the backend/API.

- **Cloudflare**
  - Act as the secure bridge/API between ChatGPT and the Android app.
  - Authenticate requests.
  - Validate and normalize reminder payloads.
  - Expose webhooks/API endpoints for the Android client.
  - Optionally handle scheduled backend jobs, retries, and synchronization.
  - Never be responsible for the final device alarm.

- **Supabase (optional / likely)**
  - Store reminders and their state.
  - Store device/user configuration and synchronization metadata.
  - Provide persistence if reminders need to survive app restarts or backend restarts.

- **Android app**
  - Authenticate with the backend.
  - Receive/synchronize reminder instructions.
  - Schedule the actual alarm/notification using Android-native scheduling APIs.
  - Persist locally as needed so reminders remain reliable.
  - Handle Android notification/alarm permissions and device-specific restrictions.

## Example flow

1. User tells ChatGPT: "Remind me in two hours to start studying."
2. ChatGPT interprets the request and creates structured reminder data.
3. ChatGPT sends that data to the Cloudflare API.
4. Cloudflare authenticates and validates the request.
5. The reminder is persisted/synchronized through Supabase if persistence is enabled.
6. The Android app receives or syncs the reminder.
7. Android schedules the local alarm/notification.
8. At the requested time, Android fires the reminder even though Cloudflare is not directly delivering an alarm to the phone.

## Design principles

- Android owns device-level alarms and notifications.
- Cloudflare is the communication/security layer, not the alarm clock.
- Keep the API small, explicit, authenticated, and easy for an AI agent to use.
- Make reminder creation idempotent where possible so retries do not create duplicate alarms.
- Store stable reminder IDs so ChatGPT/backend/app can refer to the same reminder.
- Design for offline synchronization and Android process/app restarts.
- Keep secrets and privileged credentials out of the Android client.
- Start with reminders/alarms; add more assistant actions later.

## Initial implementation phases

1. Create the Android app shell.
2. Define the reminder data model and API contract.
3. Build the Cloudflare API.
4. Add Supabase persistence if needed.
5. Add Android authentication and synchronization.
6. Implement local Android alarm/notification scheduling.
7. Add create, update, cancel, and list reminder operations.
8. Test retries, duplicate requests, offline behavior, reboot behavior, and permission failures.
9. Connect ChatGPT/agent tooling to the API.

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

This repository currently documents the architecture and implementation plan.
# Notification Engine (Portable)

`createNotificationEngine.js` is intentionally framework-agnostic so you can copy it into another app.

## What to copy

- `src/notifications/core/createNotificationEngine.js`
- One app-specific adapter file that provides:
  - `resolveChannel({ recipient, payload })`
  - `channels = { [name]: { send({ recipient, payload }) } }`

## NotifyFlow adapter example

NotifyFlow uses:

- `resolveChannel`: active user -> `in-app`, inactive user -> `push`
- `in-app` channel -> stores notification for in-app list
- `push` channel -> sends push notification

The core engine does not depend on Express, Expo, database schema, or event names.

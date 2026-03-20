# Notification Core (Portable + OOP)

The classes in this folder are intentionally framework-agnostic so you can copy them to another app.

## What to copy

- `src/notifications/core/NotificationChannel.js`
- `src/notifications/core/NotificationManager.js`
- `src/notifications/core/NotificationDeliveryLedger.js`
- `src/notifications/core/ActiveStateChannelResolver.js`

## Responsibilities

- `NotificationChannel`: base class for all delivery channels.
- `NotificationManager`: orchestrates dedupe, channel selection, and delivery.
- `NotificationDeliveryLedger`: adapter around your own storage/dedupe strategy.
- `ActiveStateChannelResolver`: default strategy (`in-app` for active users, `push` otherwise).

## NotifyFlow implementation

NotifyFlow plugs in two concrete channels:

- `InAppNotificationChannel` -> writes to in-app notification store.
- `PushNotificationChannel` -> sends push through Expo push service.

The core has no dependency on Express, Expo Router, event names, or database schema.

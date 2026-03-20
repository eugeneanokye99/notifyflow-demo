# 📱 NotifyFlow Demo — Agile Product Plan

## 1. Product Overview

**NotifyFlow Demo** is a lightweight mobile application designed to demonstrate **smart notification delivery** using Expo.

The app showcases how notifications are triggered between users based on events, with delivery optimized depending on user activity:

* 📲 **Push notification** → when user is outside the app
* 🔔 **In-app notification** → when user is actively using the app

---

## 2. Product Goal

To demonstrate:

* Role-based notifications
* Event-driven communication
* Smart notification routing (in-app vs push)
* Real-time interaction between users

---

## 3. Target Users

### 👤 Customer

* Creates orders
* Receives updates

### 👷 Staff

* Receives new orders
* Updates order status

---

## 4. Core Features

### 🔹 Order Creation

Customer creates a simple order

### 🔹 Order Notification

Staff receives:

* Push notification (if offline)
* In-app notification (if active)

### 🔹 Order Update

Staff updates order status

### 🔹 Status Notification

Customer receives update via:

* Push OR
* In-app notification

---

## 5. Application Flow

### Step 1: Customer creates order

* Order is submitted
* Event triggered: `ORDER_CREATED`

### Step 2: Staff is notified

* If active → show in-app notification
* If inactive → send push notification

### Step 3: Staff updates order

* Status: Accepted / Ready
* Event triggered: `ORDER_UPDATED`

### Step 4: Customer is notified

* Same smart notification logic applies

---

## 6. Notification Logic

```
IF user is active in app:
    show in-app notification
ELSE:
    send push notification
```

---

## 7. Tech Stack

### Frontend

* React Native (Expo)
* Expo Notifications
* Expo Router
* Axios
* Zustand (or simple state)

### Backend

* Node.js (Express)
* TypeScript
* OOP architecture

### Database

* SQLite (for demo) OR PostgreSQL
* Prisma ORM

### Notifications

* Expo Push Service

---

## 8. Agile Approach

### Sprint Duration

* 1 week per sprint

### Total Sprints

* 3–4 sprints

---

# 🧩 Sprint Breakdown

## 🚀 Sprint 1 — Foundation

### Goals

* Set up project structure
* Basic authentication
* Role selection

### Tasks

* Initialize Expo app
* Setup backend server
* Create user login/register
* Implement role selection (Customer / Staff)

### Deliverable

Users can log in and access app

---

## 📦 Sprint 2 — Order Workflow

### Goals

* Build core order flow

### Tasks

* Create order screen (Customer)
* Order list screen (Staff)
* Basic order state (created, updated)
* API integration

### Deliverable

Customer can create orders, Staff can view them

---

## 🔔 Sprint 3 — Notifications

### Goals

* Implement notification system

### Tasks

* Request notification permissions
* Get Expo push token
* Store device token
* Send push notification from backend
* Implement in-app notification UI

### Deliverable

Notifications working end-to-end

---

## ⚡ Sprint 4 — Smart Notification Logic

### Goals

* Implement intelligent routing

### Tasks

* Detect active users
* Implement in-app vs push logic
* Handle notification tap navigation
* Polish UI/UX

### Deliverable

Smart notification system fully functional

---

# 🧾 User Stories & Acceptance Criteria

---

## 🧑‍💼 Customer Stories

### 1. Create Order

**User Story**
As a customer, I want to create an order so that staff can process it.

**Acceptance Criteria**

* User can enter order details
* Order is successfully created
* Confirmation is shown

---

### 2. Receive Order Updates

**User Story**
As a customer, I want to receive updates when my order changes.

**Acceptance Criteria**

* Receive push notification when app is closed
* Receive in-app notification when app is open
* Notification opens order details

---

## 👷 Staff Stories

### 3. Receive New Orders

**User Story**
As staff, I want to be notified when a new order is created.

**Acceptance Criteria**

* Notification appears when order is created
* Works both in-app and push
* Tapping notification opens order

---

### 4. Update Order Status

**User Story**
As staff, I want to update order status.

**Acceptance Criteria**

* Can mark order as “Accepted” or “Ready”
* Status update is saved
* Customer is notified

---

## 🔔 Notification System Stories

### 5. Smart Notification Delivery

**User Story**
As a system, I want to send notifications intelligently.

**Acceptance Criteria**

* If user is active → in-app notification
* If user is inactive → push notification
* No duplicate notifications

---

# 🧪 Definition of Done

A feature is complete when:

* Functionality works end-to-end
* UI is usable
* Notifications behave correctly
* No major bugs
* Code is clean and structured

---

# ⚠️ Risks & Considerations

* Push notifications require **real device**
* Expo Go limitations (use dev build)
* Network dependency for backend
* Managing active user detection

---

# 🎯 Demo Checklist

Before presenting:

* [ ] Two devices ready (Customer + Staff)
* [ ] Both logged in
* [ ] Notifications enabled
* [ ] Backend running

### Demo Flow

1. Customer creates order
2. Staff receives notification
3. Staff updates order
4. Customer receives notification

---

# 🧭 Final Product Statement

**NotifyFlow Demo is a minimal workflow application that demonstrates smart notification delivery between users using Expo notifications, with dynamic switching between in-app and push notifications based on user activity.**

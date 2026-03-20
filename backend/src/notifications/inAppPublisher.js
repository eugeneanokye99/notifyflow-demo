const store = require('../data/store');

function publishInAppNotification({ userId, title, message, data }) {
  const notification = {
    id: store.nextNotificationId++,
    userId: Number(userId),
    title,
    message,
    data: data || {},
    read: false,
    channel: 'in-app',
    createdAt: new Date().toISOString()
  };

  store.notifications.push(notification);
  return notification;
}

function listUserNotifications(userId) {
  return store.notifications
    .filter((notification) => notification.userId === Number(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = {
  publishInAppNotification,
  listUserNotifications
};

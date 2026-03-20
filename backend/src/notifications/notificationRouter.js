const {
  NotificationManager,
  NotificationDeliveryLedger,
  ActiveStateChannelResolver
} = require('./core');
const { sendPushNotification } = require('./pushSender');
const { publishInAppNotification } = require('./inAppPublisher');
const { buildDeliveryKey, hasDelivered, markDelivered } = require('./deliveryLedger');
const { InAppNotificationChannel } = require('./providers/InAppNotificationChannel');
const { PushNotificationChannel } = require('./providers/PushNotificationChannel');
const { presenceActiveGraceMs } = require('../config/env');

function notificationLogger(payload) {
  const timestamp = new Date().toISOString();
  console.log(`[notifyflow][${timestamp}]`, JSON.stringify(payload));
}

const notificationManager = new NotificationManager({
  channels: {
    'in-app': new InAppNotificationChannel({ publisher: publishInAppNotification }),
    push: new PushNotificationChannel({ sender: sendPushNotification })
  },
  channelResolver: new ActiveStateChannelResolver({ activeWithinMs: presenceActiveGraceMs }),
  deliveryLedger: new NotificationDeliveryLedger({
    buildKey: buildDeliveryKey,
    hasDelivered,
    markDelivered
  }),
  logger: notificationLogger
});

async function routeNotification({ recipient, title, message, data }) {
  return notificationManager.dispatch({
    recipient,
    payload: {
      title,
      message,
      data
    }
  });
}

module.exports = {
  routeNotification
};

const { Expo } = require('expo-server-sdk');

const expo = new Expo();

async function sendPushNotification({ user, title, message, data }) {
  if (!user?.pushToken) {
    return {
      delivered: false,
      channel: 'push',
      reason: 'missing_push_token'
    };
  }

  if (!Expo.isExpoPushToken(user.pushToken)) {
    return {
      delivered: false,
      channel: 'push',
      reason: 'invalid_push_token'
    };
  }

  try {
    const messages = [
      {
        to: user.pushToken,
        sound: 'default',
        title,
        body: message,
        data: data || {}
      }
    ];

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    const firstTicket = tickets[0];
    if (!firstTicket || firstTicket.status !== 'ok') {
      return {
        delivered: false,
        channel: 'push',
        reason: 'expo_push_error',
        details: firstTicket?.message || firstTicket?.details || null
      };
    }

    return {
      delivered: true,
      channel: 'push',
      ticketId: firstTicket.id || null
    };
  } catch (error) {
    return {
      delivered: false,
      channel: 'push',
      reason: 'network_error',
      details: error?.message || 'push send failed'
    };
  }
}

module.exports = {
  sendPushNotification
};

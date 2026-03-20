const { NotificationChannel } = require('../core');

class PushNotificationChannel extends NotificationChannel {
  constructor({ sender }) {
    super('push');
    this.sender = sender;
  }

  send({ recipient, payload }) {
    return this.sender({
      user: recipient,
      title: payload.title,
      message: payload.message,
      data: payload.data
    });
  }
}

module.exports = {
  PushNotificationChannel
};

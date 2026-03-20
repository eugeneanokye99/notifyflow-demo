const { NotificationChannel } = require('../core');

class InAppNotificationChannel extends NotificationChannel {
  constructor({ publisher }) {
    super('in-app');
    this.publisher = publisher;
  }

  async send({ recipient, payload }) {
    this.publisher({
      userId: recipient.id,
      title: payload.title,
      message: payload.message,
      data: payload.data
    });

    return {
      delivered: true,
      channel: this.name
    };
  }
}

module.exports = {
  InAppNotificationChannel
};

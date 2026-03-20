class NotificationManager {
  constructor({ channels, channelResolver, deliveryLedger }) {
    this.channels = channels || {};
    this.channelResolver = channelResolver;
    this.deliveryLedger = deliveryLedger;
  }

  async dispatch({ recipient, payload }) {
    if (!recipient) {
      return { delivered: false, reason: 'missing_recipient' };
    }

    const deliveryKey = this.deliveryLedger.buildDeliveryKey({ recipient, payload });

    if (this.deliveryLedger.alreadyDelivered(deliveryKey)) {
      return {
        delivered: false,
        deduplicated: true,
        reason: 'duplicate_notification'
      };
    }

    const channelName = this.channelResolver.resolve({ recipient, payload });
    const channel = this.channels[channelName];

    if (!channel || typeof channel.send !== 'function') {
      return {
        delivered: false,
        reason: 'unknown_channel',
        channel: channelName || null
      };
    }

    const result = await channel.send({ recipient, payload });

    if (result?.delivered) {
      this.deliveryLedger.recordDelivery(deliveryKey);
    }

    return result;
  }
}

module.exports = {
  NotificationManager
};

class NotificationManager {
  constructor({ channels, channelResolver, deliveryLedger, logger }) {
    this.channels = channels || {};
    this.channelResolver = channelResolver;
    this.deliveryLedger = deliveryLedger;
    this.logger = typeof logger === 'function' ? logger : null;
  }

  log(event, details) {
    if (!this.logger) {
      return;
    }

    this.logger({ event, ...details });
  }

  async dispatch({ recipient, payload }) {
    if (!recipient) {
      this.log('notification_skipped', { reason: 'missing_recipient' });
      return { delivered: false, reason: 'missing_recipient' };
    }

    const deliveryKey = this.deliveryLedger.buildDeliveryKey({ recipient, payload });

    if (this.deliveryLedger.alreadyDelivered(deliveryKey)) {
      this.log('notification_deduplicated', {
        recipientId: recipient.id,
        deliveryKey,
        type: payload?.data?.type || 'generic'
      });

      return {
        delivered: false,
        deduplicated: true,
        reason: 'duplicate_notification'
      };
    }

    const resolution =
      typeof this.channelResolver?.getResolution === 'function'
        ? this.channelResolver.getResolution({ recipient, payload })
        : { channel: this.channelResolver.resolve({ recipient, payload }), reason: 'resolver_default' };

    const channelName = resolution.channel;
    const channel = this.channels[channelName];

    this.log('notification_routing', {
      recipientId: recipient.id,
      channel: channelName || null,
      routingReason: resolution.reason,
      isActive: Boolean(recipient?.isActive),
      lastSeenAt: recipient?.lastSeenAt || null,
      type: payload?.data?.type || 'generic'
    });

    if (!channel || typeof channel.send !== 'function') {
      this.log('notification_failed', {
        recipientId: recipient.id,
        reason: 'unknown_channel',
        channel: channelName || null
      });

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

    this.log('notification_delivery_result', {
      recipientId: recipient.id,
      channel: result?.channel || channelName || null,
      delivered: Boolean(result?.delivered),
      reason: result?.reason || null,
      type: payload?.data?.type || 'generic'
    });

    return result;
  }
}

module.exports = {
  NotificationManager
};

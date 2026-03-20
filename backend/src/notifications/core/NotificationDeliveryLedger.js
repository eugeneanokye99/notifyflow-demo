class NotificationDeliveryLedger {
  constructor({ hasDelivered, markDelivered, buildKey }) {
    this.hasDelivered = hasDelivered;
    this.markDelivered = markDelivered;
    this.buildKey = buildKey;
  }

  buildDeliveryKey({ recipient, payload }) {
    return this.buildKey({ recipient, payload });
  }

  alreadyDelivered(deliveryKey) {
    return this.hasDelivered(deliveryKey);
  }

  recordDelivery(deliveryKey) {
    this.markDelivered(deliveryKey);
  }
}

module.exports = {
  NotificationDeliveryLedger
};

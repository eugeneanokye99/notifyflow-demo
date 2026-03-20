const store = require('../data/store');

const MAX_LEDGER_SIZE = 1000;

function buildDeliveryKey({ recipient, payload }) {
  const recipientId = recipient?.id || 'unknown';
  const type = payload?.data?.type || 'generic';
  const orderId = payload?.data?.orderId || 'none';
  const title = payload?.title || '';
  const message = payload?.message || '';

  return `${recipientId}|${type}|${orderId}|${title}|${message}`;
}

function hasDelivered(key) {
  return store.deliveryLedger.includes(key);
}

function markDelivered(key) {
  if (hasDelivered(key)) return;

  store.deliveryLedger.push(key);

  if (store.deliveryLedger.length > MAX_LEDGER_SIZE) {
    store.deliveryLedger = store.deliveryLedger.slice(-MAX_LEDGER_SIZE);
  }
}

module.exports = {
  buildDeliveryKey,
  hasDelivered,
  markDelivered
};

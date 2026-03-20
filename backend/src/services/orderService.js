const store = require('../data/store');
const { getUserById } = require('./authService');
const { eventBus, EVENTS } = require('../events/eventBus');

const VALID_STATUSES = ['created', 'accepted', 'ready'];

function createOrder({ customerId, description }) {
  const customer = getUserById(customerId);
  if (!customer || customer.role !== 'customer') {
    const error = new Error('valid customerId is required');
    error.status = 400;
    throw error;
  }

  if (!description || !String(description).trim()) {
    const error = new Error('description is required');
    error.status = 400;
    throw error;
  }

  const order = {
    id: store.nextOrderId++,
    customerId: customer.id,
    description: String(description).trim(),
    status: 'created',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.orders.push(order);
  eventBus.emit(EVENTS.ORDER_CREATED, { order });

  return order;
}

function listOrders() {
  return [...store.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function updateOrderStatus({ orderId, staffId, status }) {
  const staff = getUserById(staffId);
  if (!staff || staff.role !== 'staff') {
    const error = new Error('valid staffId is required');
    error.status = 400;
    throw error;
  }

  const nextStatus = String(status || '').toLowerCase();
  if (!VALID_STATUSES.includes(nextStatus) || nextStatus === 'created') {
    const error = new Error('status must be accepted or ready');
    error.status = 400;
    throw error;
  }

  const order = store.orders.find((item) => item.id === Number(orderId));
  if (!order) {
    const error = new Error('order not found');
    error.status = 404;
    throw error;
  }

  order.status = nextStatus;
  order.updatedAt = new Date().toISOString();
  order.updatedByStaffId = staff.id;

  eventBus.emit(EVENTS.ORDER_UPDATED, { order, staff });
  return order;
}

module.exports = {
  createOrder,
  listOrders,
  updateOrderStatus
};

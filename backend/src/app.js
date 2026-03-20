const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const presenceRoutes = require('./routes/presenceRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const {
  clientUrl,
  demoRandomNotificationsEnabled,
  demoRandomNotificationsIntervalMs
} = require('./config/env');
const { eventBus, EVENTS } = require('./events/eventBus');
const { routeNotification } = require('./notifications/notificationRouter');
const { startDemoRandomTicker } = require('./notifications/demoRandomTicker');
const store = require('./data/store');

const app = express();

app.use(cors({ origin: clientUrl }));
app.use(express.json());

app.use(healthRoutes);
app.use(authRoutes);
app.use(orderRoutes);
app.use(presenceRoutes);

eventBus.on(EVENTS.ORDER_CREATED, async ({ order }) => {
  const recipients = store.users.filter((user) => user.role === 'staff');

  for (const recipient of recipients) {
    await routeNotification({
      recipient,
      title: 'New order created',
      message: `Order #${order.id}: ${order.description}`,
      data: { orderId: order.id, type: EVENTS.ORDER_CREATED }
    });
  }
});

eventBus.on(EVENTS.ORDER_UPDATED, async ({ order }) => {
  const customer = store.users.find((user) => user.id === order.customerId);

  if (!customer) return;

  await routeNotification({
    recipient: customer,
    title: 'Order updated',
    message: `Order #${order.id} is now ${order.status}`,
    data: { orderId: order.id, type: EVENTS.ORDER_UPDATED }
  });
});

startDemoRandomTicker({
  getRecipients: () => store.users,
  intervalMs: demoRandomNotificationsIntervalMs,
  isEnabled: demoRandomNotificationsEnabled
});

app.use(errorHandler);

module.exports = app;

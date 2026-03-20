const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT) || 4000,
  clientUrl: process.env.CLIENT_URL || '*',
  demoRandomNotificationsEnabled: process.env.DEMO_RANDOM_NOTIFICATIONS_ENABLED !== 'false',
  demoRandomNotificationsIntervalMs: Number(process.env.DEMO_RANDOM_NOTIFICATIONS_INTERVAL_MS) || 60000
};

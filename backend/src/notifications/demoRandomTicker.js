const { routeNotification } = require('./notificationRouter');

const SAMPLE_MESSAGES = [
  'A quick status check is available.',
  'You have a demo activity update.',
  'Tap to open your latest notification.',
  'A random workflow ping just arrived.'
];

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function pickRandomMessage() {
  return SAMPLE_MESSAGES[randomInt(SAMPLE_MESSAGES.length)];
}

function startDemoRandomTicker({ getRecipients, intervalMs = 60000, isEnabled = true }) {
  if (!isEnabled) {
    return () => {};
  }

  const timer = setInterval(async () => {
    const recipients = getRecipients();

    for (const recipient of recipients) {
      const shouldNotify = Math.random() < 0.5;
      if (!shouldNotify) continue;

      const nonce = `${Date.now()}-${randomInt(100000)}`;
      await routeNotification({
        recipient,
        title: 'NotifyFlow Demo Ping',
        message: pickRandomMessage(),
        data: {
          type: 'DEMO_RANDOM',
          nonce
        }
      });
    }
  }, intervalMs);

  return () => clearInterval(timer);
}

module.exports = {
  startDemoRandomTicker
};

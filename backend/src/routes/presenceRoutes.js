const express = require('express');
const { setUserPresence } = require('../services/presenceService');
const { listUserNotifications } = require('../notifications/inAppPublisher');

const router = express.Router();

router.post('/presence', (req, res) => {
  const { userId, isActive } = req.body || {};
  const user = setUserPresence(userId, isActive);
  res.json({ user });
});

router.get('/notifications/:userId', (req, res) => {
  const notifications = listUserNotifications(req.params.userId);
  res.json({ notifications });
});

module.exports = router;

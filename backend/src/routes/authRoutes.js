const express = require('express');
const { registerOrLogin, savePushToken } = require('../services/authService');

const router = express.Router();

router.post('/auth', (req, res) => {
  const user = registerOrLogin(req.body || {});
  res.status(200).json({ user });
});

router.post('/auth/push-token', (req, res) => {
  const { userId, pushToken } = req.body || {};
  const user = savePushToken(userId, pushToken);
  res.json({ user });
});

module.exports = router;

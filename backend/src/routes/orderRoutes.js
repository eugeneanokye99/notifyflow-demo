const express = require('express');
const { createOrder, listOrders, updateOrderStatus } = require('../services/orderService');

const router = express.Router();

router.get('/orders', (req, res) => {
  res.json({ orders: listOrders() });
});

router.post('/orders', (req, res) => {
  const order = createOrder(req.body || {});
  res.status(201).json({ order });
});

router.patch('/orders/:orderId/status', (req, res) => {
  const order = updateOrderStatus({
    orderId: req.params.orderId,
    staffId: req.body?.staffId,
    status: req.body?.status
  });

  res.json({ order });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// GET all orders
router.get('/', orderController.getAllOrders);

// GET a single order
router.get('/:id', orderController.getOrderById);

// POST a new order
router.post('/', orderController.createOrder);

// PUT update an order
router.put('/:id', orderController.updateOrder);

// DELETE an order (soft delete)
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
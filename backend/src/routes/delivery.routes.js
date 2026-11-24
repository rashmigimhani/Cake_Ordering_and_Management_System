const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');

// GET all deliveries
router.get('/', deliveryController.getAllDeliveries);

// GET a single delivery
router.get('/:id', deliveryController.getDeliveryById);

// POST a new delivery
router.post('/', deliveryController.createDelivery);

// PUT update a delivery
router.put('/:id', deliveryController.updateDelivery);

// DELETE a delivery (soft delete)
router.delete('/:id', deliveryController.deleteDelivery);

module.exports = router;
const express = require('express');
const router = express.Router();
const deliveryPersonnelController = require('../controllers/deliveryPersonnel.controller');

// GET all delivery personnel
router.get('/', deliveryPersonnelController.getAllDeliveryPersonnel);

// GET a single delivery personnel
router.get('/:id', deliveryPersonnelController.getDeliveryPersonnelById);

// POST a new delivery personnel
router.post('/', deliveryPersonnelController.createDeliveryPersonnel);

// PUT update a delivery personnel
router.put('/:id', deliveryPersonnelController.updateDeliveryPersonnel);

// DELETE a delivery personnel (soft delete)
router.delete('/:id', deliveryPersonnelController.deleteDeliveryPersonnel);

module.exports = router;
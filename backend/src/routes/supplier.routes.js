const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');

// GET all suppliers
router.get('/', supplierController.getAllSuppliers);

// GET a single supplier
router.get('/:id', supplierController.getSupplierById);

// POST a new supplier
router.post('/', supplierController.createSupplier);

// PUT update a supplier
router.put('/:id', supplierController.updateSupplier);

// DELETE a supplier (soft delete)
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
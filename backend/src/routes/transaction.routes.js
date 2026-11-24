const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

// GET all transactions
router.get('/', transactionController.getAllTransactions);

// GET a single transaction
router.get('/:id', transactionController.getTransactionById);

// POST a new transaction
router.post('/', transactionController.createTransaction);

// PUT update a transaction
router.put('/:id', transactionController.updateTransaction);

// DELETE a transaction (soft delete)
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
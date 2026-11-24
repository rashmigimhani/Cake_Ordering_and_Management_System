const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");

// GET all customers
router.get("/", customerController.getAllCustomers);

// GET a single customer
router.get("/:id", customerController.getCustomerById);

// POST a new customer
router.post("/", customerController.createCustomer);

// PUT update a customer
router.put("/:id", customerController.updateCustomer);

// DELETE a customer (soft delete)
router.delete("/:id", customerController.deleteCustomer);

router.post("/login", customerController.loginCustomer);

module.exports = router;

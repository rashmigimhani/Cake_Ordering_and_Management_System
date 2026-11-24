const Customer = require("../models/customer.model");

// Get all customers (excluding deleted ones)
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ deleted: false });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const customer = new Customer({...req.body,pp:req.body.passwordHash});
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a customer
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete a customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer login
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email);

    // Check if customer exists
    const customer = await Customer.findOne({ email, deleted: false });
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = password === customer.pp;
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid  password" });
    }

    res.status(200).json({
      message: "Login successful",
      customer: {
        id: customer._id,
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the exports
module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  loginCustomer, // Add this line
};

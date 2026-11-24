const Supplier = require('../models/supplier.model');

// Get all suppliers (excluding deleted ones)
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ deleted: false });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ _id: req.params.id, deleted: false });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new supplier
const createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a supplier
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete a supplier
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
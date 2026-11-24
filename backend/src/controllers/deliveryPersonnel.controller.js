const DeliveryPersonnel = require('../models/deliveryPersonnel.model');

// Get all delivery personnel (excluding deleted ones)
const getAllDeliveryPersonnel = async (req, res) => {
  try {
    const personnel = await DeliveryPersonnel.find({ deleted: false });
    res.status(200).json(personnel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single delivery personnel by ID
const getDeliveryPersonnelById = async (req, res) => {
  try {
    const personnel = await DeliveryPersonnel.findOne({ _id: req.params.id, deleted: false });
    if (!personnel) {
      return res.status(404).json({ message: 'Delivery personnel not found' });
    }
    res.status(200).json(personnel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new delivery personnel
const createDeliveryPersonnel = async (req, res) => {
  try {
    const personnel = new DeliveryPersonnel(req.body);
    const savedPersonnel = await personnel.save();
    res.status(201).json(savedPersonnel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a delivery personnel
const updateDeliveryPersonnel = async (req, res) => {
  try {
    const personnel = await DeliveryPersonnel.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!personnel) {
      return res.status(404).json({ message: 'Delivery personnel not found' });
    }
    res.status(200).json(personnel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete a delivery personnel
const deleteDeliveryPersonnel = async (req, res) => {
  try {
    const personnel = await DeliveryPersonnel.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    if (!personnel) {
      return res.status(404).json({ message: 'Delivery personnel not found' });
    }
    res.status(200).json({ message: 'Delivery personnel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDeliveryPersonnel,
  getDeliveryPersonnelById,
  createDeliveryPersonnel,
  updateDeliveryPersonnel,
  deleteDeliveryPersonnel
};
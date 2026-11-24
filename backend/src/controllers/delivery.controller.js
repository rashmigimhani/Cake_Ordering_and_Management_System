const Delivery = require('../models/delivery.model');

// Get all deliveries (excluding deleted ones)
const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ deleted: false })
      .populate('orderId')
      .populate('deliveryPersonId', 'fullName phoneNumber');
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single delivery by ID
const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ _id: req.params.id, deleted: false })
      .populate('orderId')
      .populate('deliveryPersonId', 'fullName phoneNumber');
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new delivery
const createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    const savedDelivery = await delivery.save();
    res.status(201).json(savedDelivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a delivery
const updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    res.status(200).json(delivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete a delivery
const deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    res.status(200).json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery
};
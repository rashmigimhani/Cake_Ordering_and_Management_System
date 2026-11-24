const Order = require("../models/order.model");
const Customer = require("../models/customer.model");

// Get all orders (excluding deleted ones)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deleted: false })
      .populate("customerId", "firstName lastName email")
      .populate("invoiceId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, deleted: false })
      .populate("customerId", "firstName lastName email")
      .populate("invoiceId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();

    const customer = await Customer.findById(savedOrder.customerId);
    if (customer) {
      customer.loyaltyPoints = (customer.loyaltyPoints || 0) + 10;
      await customer.save();
    }

    // Add order to customer's orderHistory
    await Customer.findByIdAndUpdate(savedOrder.customerId, {
      $push: { orderHistory: savedOrder._id },
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete an order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};

const SupportTicket = require("../models/support.ticket.model");

// Get all tickets for a customer (excluding deleted ones)
const getAllTickets = async (req, res) => {
  try {
    console.log("called");
    const tickets = await SupportTicket.find({
      customer: req.params.customerId,
      deleteStatus: false,
    }).populate("customer", "firstName lastName email");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTicketsForAdmin = async (req, res) => {
  try {
    console.log("called");
    const tickets = await SupportTicket.find().populate(
      "customer",
      "firstName lastName email"
    );
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      deleteStatus: false,
    }).populate("customer", "firstName lastName email");
    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new support ticket
const createTicket = async (req, res) => {
  try {
    const ticket = new SupportTicket(req.body);
    const savedTicket = await ticket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a support ticket
const updateTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOneAndUpdate(
      { _id: req.params.id, deleteStatus: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete a support ticket
const deleteTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOneAndUpdate(
      { _id: req.params.id, deleteStatus: false },
      { deleteStatus: true },
      { new: true }
    );
    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }
    res.status(200).json({ message: "Support ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getAllTicketsForAdmin,
};

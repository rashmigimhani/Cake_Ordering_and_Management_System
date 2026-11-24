const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/support.ticket.controller.js");

// GET all tickets for a customer
router.get("/customer/:customerId", ticketController.getAllTickets);
router.get("/admin", ticketController.getAllTicketsForAdmin);

// GET a single ticket
router.get("/:id", ticketController.getTicketById);

// POST a new ticket
router.post("/", ticketController.createTicket);

// PUT update a ticket
router.put("/:id", ticketController.updateTicket);

// DELETE a ticket (soft delete)
router.delete("/:id", ticketController.deleteTicket);

module.exports = router;

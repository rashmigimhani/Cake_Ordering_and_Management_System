import api from "@/lib/axios_instance";

export const ticketApi = {
  // Get all tickets for a customer
  getAllTickets: async (customerId) => {
    const response = await api.get(`/tickets/customer/${customerId}`);
    return response.data;
  },
  getAllTicketsForAdmin: async () => {
    const response = await api.get(`/tickets/admin`);
    return response.data;
  },

  // Get a single ticket by ID
  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Create a new ticket
  createTicket: async (ticketData) => {
    const response = await api.post("/tickets", ticketData);
    return response.data;
  },

  // Update a ticket
  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  // Soft delete a ticket
  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },
};

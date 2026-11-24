import api from "@/lib/axios_instance";

export const customerApi = {
  // Get all customers
  getAllCustomers: async () => {
    const response = await api.get("/customers");
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  // Create customer
  createCustomer: async (customerData) => {
    const response = await api.post("/customers", customerData);
    return response.data;
  },
  loginCustomer: async (customerData) => {
    const response = await api.post("/customers/login", customerData);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
};

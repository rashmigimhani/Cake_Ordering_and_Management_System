import api from "@/lib/axios_instance";

export const deliveryApi = {
  // Get all deliveries
  getAllDeliveries: async () => {
    const response = await api.get("/deliveries");
    return response.data;
  },

  // Get delivery by ID
  getDeliveryById: async (id) => {
    const response = await api.get(`/deliveries/${id}`);
    return response.data;
  },

  // Create delivery
  createDelivery: async (deliveryData) => {
    const response = await api.post("/deliveries", deliveryData);
    return response.data;
  },

  // Update delivery
  updateDelivery: async (id, deliveryData) => {
    const response = await api.put(`/deliveries/${id}`, deliveryData);
    return response.data;
  },

  // Delete delivery
  deleteDelivery: async (id) => {
    const response = await api.delete(`/deliveries/${id}`);
    return response.data;
  },
};

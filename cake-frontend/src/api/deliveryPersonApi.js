import api from "@/lib/axios_instance";

export const deliveryPersonApi = {
  // Get all delivery personnel
  getAllDeliveryPersons: async () => {
    const response = await api.get("/delivery-personnel");
    return response.data;
  },

  // Get delivery personnel by ID
  getDeliveryPersonById: async (id) => {
    const response = await api.get(`/delivery-personnel/${id}`);
    return response.data;
  },

  // Create delivery personnel
  createDeliveryPerson: async (deliveryPersonData) => {
    const response = await api.post("/delivery-personnel", deliveryPersonData);
    return response.data;
  },

  // Update delivery personnel
  updateDeliveryPerson: async (id, deliveryPersonData) => {
    const response = await api.put(
      `/delivery-personnel/${id}`,
      deliveryPersonData
    );
    return response.data;
  },

  // Delete delivery personnel
  deleteDeliveryPerson: async (id) => {
    const response = await api.delete(`/delivery-personnel/${id}`);
    return response.data;
  },
};

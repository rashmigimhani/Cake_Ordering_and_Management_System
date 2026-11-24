import api from "@/lib/axios_instance";

export const supplierApi = {
  // Get all suppliers
  getAllSuppliers: async () => {
    const response = await api.get("/suppliers");
    return response.data;
  },

  // Get supplier by ID
  getSupplierById: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  // Create supplier
  createSupplier: async (supplierData) => {
    const response = await api.post("/suppliers", supplierData);
    return response.data;
  },

  // Update supplier
  updateSupplier: async (id, supplierData) => {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
  },

  // Delete supplier
  deleteSupplier: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },
};

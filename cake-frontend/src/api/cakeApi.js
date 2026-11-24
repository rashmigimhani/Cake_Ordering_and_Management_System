import api from "@/lib/axios_instance";

export const cakeApi = {
  // Get all cakes
  getAllCakes: async () => {
    const response = await api.get("/cakes");
    return response.data;
  },

  // Get available cakes (in stock)
  getAvailableCakes: async () => {
    const response = await api.get("/cakes/available");
    return response.data;
  },

  // Get cakes by price range
  getCakesByPriceRange: async (minPrice, maxPrice) => {
    const params = {};
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    
    const response = await api.get("/cakes/price-range", { params });
    return response.data;
  },

  // Search cakes by name
  searchCakesByName: async (name) => {
    const response = await api.get("/cakes/search", { 
      params: { name } 
    });
    return response.data;
  },

  // Get cake by ID
  getCakeById: async (id) => {
    const response = await api.get(`/cakes/${id}`);
    return response.data;
  },

  // Create cake
  createCake: async (cakeData) => {
    const response = await api.post("/cakes", cakeData);
    return response.data;
  },

  // Update cake
  updateCake: async (id, cakeData) => {
    const response = await api.put(`/cakes/${id}`, cakeData);
    return response.data;
  },

  // Delete cake
  deleteCake: async (id) => {
    const response = await api.delete(`/cakes/${id}`);
    return response.data;
  },

  // Reduce stock
  reduceStock: async (id, amount) => {
    const response = await api.post(`/cakes/${id}/reduce-stock`, { amount });
    return response.data;
  },

  // Add stock
  addStock: async (id, amount) => {
    const response = await api.post(`/cakes/${id}/add-stock`, { amount });
    return response.data;
  },

  // Get cakes by type
  getCakesByType: async (type) => {
    const response = await api.get(`/cakes/type/${type}`);
    return response.data;
  },

  // Get featured cakes
  getFeaturedCakes: async () => {
    const response = await api.get("/cakes/featured");
    return response.data;
  },

  // Get cakes by category
  getCakesByCategory: async (category) => {
    const response = await api.get(`/cakes/category/${category}`);
    return response.data;
  },

  // Get cakes by tags
  getCakesByTags: async (tags) => {
    const response = await api.get("/cakes/tags", { 
      params: { tags: Array.isArray(tags) ? tags.join(',') : tags } 
    });
    return response.data;
  },

  // Calculate price for a cake with size and theme
  calculateCakePrice: async (id, size, theme) => {
    const response = await api.post(`/cakes/${id}/calculate-price`, { size, theme });
    return response.data;
  },

  // Get available sizes for a cake
  getCakeSizes: async (id) => {
    const response = await api.get(`/cakes/${id}/sizes`);
    return response.data;
  },

  // Get available themes for a cake
  getCakeThemes: async (id) => {
    const response = await api.get(`/cakes/${id}/themes`);
    return response.data;
  },
};

import api from "@/lib/axios_instance";

export const ingredientApi = {
  // Get all ingredients
  getAllIngredients: async () => {
    const response = await api.get("/ingredients");
    return response.data;
  },

  // Get ingredient by ID
  getIngredientById: async (id) => {
    const response = await api.get(`/ingredients/${id}`);
    return response.data;
  },

  // Create ingredient
  createIngredient: async (ingredientData) => {
    const response = await api.post("/ingredients", ingredientData);
    return response.data;
  },

  // Update ingredient
  updateIngredient: async (id, ingredientData) => {
    const response = await api.put(`/ingredients/${id}`, ingredientData);
    return response.data;
  },

  // Delete ingredient
  deleteIngredient: async (id) => {
    const response = await api.delete(`/ingredients/${id}`);
    return response.data;
  },
};

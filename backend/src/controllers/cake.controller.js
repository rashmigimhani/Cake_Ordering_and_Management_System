const Cake = require("../models/cake.model");

// Get all cakes (excluding deleted ones)
const getAllCakes = async (req, res) => {
  try {
    const cakes = await Cake.find({ deleted: false });
    res.status(200).json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all available cakes (in stock)
const getAvailableCakes = async (req, res) => {
  try {
    const cakes = await Cake.findAvailable();
    res.status(200).json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single cake by ID
const getCakeById = async (req, res) => {
  try {
    const cake = await Cake.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!cake) {
      return res.status(404).json({ message: "Cake not found" });
    }
    res.status(200).json(cake);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search cakes by name
const searchCakesByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Name parameter is required" });
    }
    
    const cakes = await Cake.findByName(name);
    res.status(200).json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new cake
const createCake = async (req, res) => {
  try {
    const cake = new Cake(req.body);
    const savedCake = await cake.save();
    res.status(201).json(savedCake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a cake
const updateCake = async (req, res) => {
  try {
    const cake = await Cake.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!cake) {
      return res.status(404).json({ message: "Cake not found" });
    }
    res.status(200).json(cake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete a cake
const deleteCake = async (req, res) => {
  try {
    const cake = await Cake.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    if (!cake) {
      return res.status(404).json({ message: "Cake not found" });
    }
    res.status(200).json({ message: "Cake deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reduce stock for a cake
const reduceStock = async (req, res) => {
  try {
    const { amount } = req.body;
    const cake = await Cake.findOne({ _id: req.params.id, deleted: false });
    
    if (!cake) {
      return res.status(404).json({ message: "Cake not found" });
    }
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }
    
    await cake.reduceStock(amount);
    res.status(200).json({ 
      message: "Stock reduced successfully", 
      cake: cake 
    });
  } catch (error) {
    if (error.message === 'Insufficient stock') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// Add stock for a cake
const addStock = async (req, res) => {
  try {
    const { amount } = req.body;
    const cake = await Cake.findOne({ _id: req.params.id, deleted: false });
    
    if (!cake) {
      return res.status(404).json({ message: "Cake not found" });
    }
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }
    
    await cake.addStock(amount);
    res.status(200).json({ 
      message: "Stock added successfully", 
      cake: cake 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cakes by price range
const getCakesByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    
    const cakes = await Cake.findByPriceRange(
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined
    );
    res.status(200).json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cakes by type
const getCakesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const cakes = await Cake.findByType(type);
    res.status(200).json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured cakes
const getFeaturedCakes = async (req, res) => {
  try {
    const cakes = await Cake.findFeatured();
    res.status(200).json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cakes by category
const getCakesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const cakes = await Cake.findByCategory(category);
    res.status(200).json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cakes by tags
const getCakesByTags = async (req, res) => {
  try {
    const { tags } = req.query;
    if (!tags) {
      return res.status(400).json({ message: "Tags parameter is required" });
    }
    
    const tagArray = Array.isArray(tags) ? tags : tags.split(',');
    const cakes = await Cake.findByTags(tagArray);
    res.status(200).json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate price for a specific cake with size and theme
const calculateCakePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { size, theme } = req.body;
    
    const cake = await Cake.findOne({ _id: id, deleted: false });
    if (!cake) {
      return res.status(404).json({ message: "Cake not found" });
    }
    
    if (!size || !theme) {
      return res.status(400).json({ message: "Size and theme are required" });
    }
    
    const finalPrice = cake.calculatePrice(size, theme);
    res.status(200).json({ 
      cakeId: cake._id,
      cakeName: cake.name,
      basePrice: cake.basePrice,
      size,
      theme,
      finalPrice
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get available sizes for a cake
const getCakeSizes = async (req, res) => {
  try {
    const { id } = req.params;
    const cake = await Cake.findOne({ _id: id, deleted: false });
    if (!cake) {
      return res.status(404).json({ message: "Cake not found" });
    }
    
    res.status(200).json({ sizes: cake.availableSizes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available themes for a cake
const getCakeThemes = async (req, res) => {
  try {
    const { id } = req.params;
    const cake = await Cake.findOne({ _id: id, deleted: false });
    if (!cake) {
      return res.status(404).json({ message: "Cake not found" });
    }
    
    res.status(200).json({ themes: cake.availableThemes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCakes,
  getAvailableCakes,
  getCakeById,
  searchCakesByName,
  createCake,
  updateCake,
  deleteCake,
  reduceStock,
  addStock,
  getCakesByPriceRange,
  getCakesByType,
  getFeaturedCakes,
  getCakesByCategory,
  getCakesByTags,
  calculateCakePrice,
  getCakeSizes,
  getCakeThemes,
};

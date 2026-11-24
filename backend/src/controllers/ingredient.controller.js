const Ingredient = require('../models/ingredient.model');

// Get all ingredients (excluding deleted ones)
const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({ deleted: false })
      .populate('supplierId', 'supplierName contactPerson');
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single ingredient by ID
const getIngredientById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne({ _id: req.params.id, deleted: false })
      .populate('supplierId', 'supplierName contactPerson');
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new ingredient
const createIngredient = async (req, res) => {
  try {
    const ingredient = new Ingredient(req.body);
    const savedIngredient = await ingredient.save();
    res.status(201).json(savedIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an ingredient
const updateIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Soft delete an ingredient
const deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.status(200).json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient
};
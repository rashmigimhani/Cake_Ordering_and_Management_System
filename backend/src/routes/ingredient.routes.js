const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredient.controller');

// GET all ingredients
router.get('/', ingredientController.getAllIngredients);

// GET a single ingredient
router.get('/:id', ingredientController.getIngredientById);

// POST a new ingredient
router.post('/', ingredientController.createIngredient);

// PUT update an ingredient
router.put('/:id', ingredientController.updateIngredient);

// DELETE an ingredient (soft delete)
router.delete('/:id', ingredientController.deleteIngredient);

module.exports = router;
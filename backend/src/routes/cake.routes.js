const express = require("express");
const router = express.Router();
const cakeController = require("../controllers/cake.controller");

// GET all cakes
router.get("/", cakeController.getAllCakes);

// GET all available cakes (in stock)
router.get("/available", cakeController.getAvailableCakes);

// GET cakes by price range
router.get("/price-range", cakeController.getCakesByPriceRange);

// GET featured cakes
router.get("/featured", cakeController.getFeaturedCakes);

// GET cakes by tags
router.get("/tags", cakeController.getCakesByTags);

// GET search cakes by name
router.get("/search", cakeController.searchCakesByName);

// GET cakes by type
router.get("/type/:type", cakeController.getCakesByType);

// GET cakes by category
router.get("/category/:category", cakeController.getCakesByCategory);

// GET available sizes for a cake
router.get("/:id/sizes", cakeController.getCakeSizes);

// GET available themes for a cake
router.get("/:id/themes", cakeController.getCakeThemes);

// GET a single cake by ID
router.get("/:id", cakeController.getCakeById);

// POST create a new cake
router.post("/", cakeController.createCake);

// PUT update a cake
router.put("/:id", cakeController.updateCake);

// DELETE a cake (soft delete)
router.delete("/:id", cakeController.deleteCake);

// POST reduce stock for a cake
router.post("/:id/reduce-stock", cakeController.reduceStock);

// POST add stock for a cake
router.post("/:id/add-stock", cakeController.addStock);

// POST calculate price for a cake with size and theme
router.post("/:id/calculate-price", cakeController.calculateCakePrice);

module.exports = router;

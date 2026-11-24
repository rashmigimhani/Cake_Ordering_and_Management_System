const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
  {
    ingredientName: {
      type: String,
      required: true,
      trim: true
    },
    quantityAvailable: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    reorderLevel: {
      type: Number,
      required: true
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true
    },
    expiryDate: {
      type: Date
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Ingredient', ingredientSchema);
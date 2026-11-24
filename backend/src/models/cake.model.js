const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function(v) {
          return v >= 0;
        },
        message: 'Price must be a positive number'
      }
    },
    inStockAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      validate: {
        validator: function(v) {
          return v >= 0;
        },
        message: 'Stock amount must be a non-negative number'
      }
    },
    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty string
          // Basic URL validation
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Image URL must be a valid HTTP/HTTPS URL'
      }
    },
    // Cake type identifier (e.g., "vanilla", "chocolate", "strawberry")
    cakeType: {
      type: String,
      required: true,
      trim: true,
      enum: ['vanilla', 'chocolate', 'strawberry', 'redVelvet', 'lemon', 'carrot', 'funfetti', 'custom'],
      default: 'custom'
    },
    // Available flavors for this cake
    flavors: [{
      type: String,
      trim: true
    }],
    // Base price before any multipliers
    basePrice: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function(v) {
          return v >= 0;
        },
        message: 'Base price must be a positive number'
      }
    },
    // Available sizes for this cake
    availableSizes: [{
      size: {
        type: String,
        enum: ['small', 'medium', 'large', 'extraLarge'],
        required: true
      },
      multiplier: {
        type: Number,
        required: true,
        min: 0.1,
        max: 5.0
      },
      description: {
        type: String,
        trim: true
      }
    }],
    // Available themes for this cake
    availableThemes: [{
      theme: {
        type: String,
        enum: ['birthday', 'wedding', 'anniversary', 'graduation', 'corporate', 'baby_shower', 'valentine', 'christmas', 'custom'],
        required: true
      },
      multiplier: {
        type: Number,
        required: true,
        min: 0.1,
        max: 5.0
      },
      additionalCost: {
        type: Number,
        default: 0,
        min: 0
      },
      description: {
        type: String,
        trim: true
      }
    }],
    // Category for filtering (e.g., "birthday", "wedding", "seasonal")
    category: {
      type: String,
      trim: true,
      default: 'general'
    },
    // Tags for better searchability
    tags: [{
      type: String,
      trim: true
    }],
    // Whether this cake is featured/popular
    isFeatured: {
      type: Boolean,
      default: false
    },
    // Preparation time in hours
    preparationTime: {
      type: Number,
      min: 0,
      default: 24 // Default 24 hours
    },
    // Minimum order quantity
    minOrderQuantity: {
      type: Number,
      min: 1,
      default: 1
    },
    // Maximum order quantity (null means no limit)
    maxOrderQuantity: {
      type: Number,
      min: 1
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

// Index for better query performance
cakeSchema.index({ name: 1 });
cakeSchema.index({ deleted: 1 });
cakeSchema.index({ inStockAmount: 1 });
cakeSchema.index({ cakeType: 1 });
cakeSchema.index({ category: 1 });
cakeSchema.index({ isFeatured: 1 });
cakeSchema.index({ tags: 1 });
cakeSchema.index({ basePrice: 1 });

// Virtual for checking if cake is in stock
cakeSchema.virtual('isInStock').get(function() {
  return this.inStockAmount > 0;
});

// Method to reduce stock
cakeSchema.methods.reduceStock = function(amount) {
  if (amount > this.inStockAmount) {
    throw new Error('Insufficient stock');
  }
  this.inStockAmount -= amount;
  return this.save();
};

// Method to add stock
cakeSchema.methods.addStock = function(amount) {
  this.inStockAmount += amount;
  return this.save();
};

// Static method to find available cakes
cakeSchema.statics.findAvailable = function() {
  return this.find({ deleted: false, inStockAmount: { $gt: 0 } });
};

// Static method to find by name (case insensitive)
cakeSchema.statics.findByName = function(name) {
  return this.find({ 
    name: { $regex: new RegExp(name, 'i') }, 
    deleted: false 
  });
};

// Static method to find cakes by type
cakeSchema.statics.findByType = function(cakeType) {
  return this.find({ 
    cakeType: cakeType, 
    deleted: false 
  });
};

// Static method to find featured cakes
cakeSchema.statics.findFeatured = function() {
  return this.find({ 
    isFeatured: true, 
    deleted: false,
    inStockAmount: { $gt: 0 }
  });
};

// Static method to find cakes by category
cakeSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category: category, 
    deleted: false 
  });
};

// Static method to find cakes by tags
cakeSchema.statics.findByTags = function(tags) {
  return this.find({ 
    tags: { $in: tags }, 
    deleted: false 
  });
};

// Static method to find cakes by price range
cakeSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  const query = { deleted: false };
  if (minPrice !== undefined) query.basePrice = { $gte: minPrice };
  if (maxPrice !== undefined) {
    query.basePrice = query.basePrice || {};
    query.basePrice.$lte = maxPrice;
  }
  return this.find(query);
};

// Method to calculate final price with size and theme
cakeSchema.methods.calculatePrice = function(size, theme) {
  const sizeConfig = this.availableSizes.find(s => s.size === size);
  const themeConfig = this.availableThemes.find(t => t.theme === theme);
  
  if (!sizeConfig || !themeConfig) {
    throw new Error('Invalid size or theme for this cake');
  }
  
  const finalPrice = this.basePrice * sizeConfig.multiplier * themeConfig.multiplier + themeConfig.additionalCost;
  return Math.round(finalPrice);
};

// Method to check if cake supports a specific size
cakeSchema.methods.supportsSize = function(size) {
  return this.availableSizes.some(s => s.size === size);
};

// Method to check if cake supports a specific theme
cakeSchema.methods.supportsTheme = function(theme) {
  return this.availableThemes.some(t => t.theme === theme);
};

module.exports = mongoose.model('Cake', cakeSchema);

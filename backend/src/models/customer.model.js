const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true }
});

const preferencesSchema = new mongoose.Schema({
  favoriteFlavors: [String],
  icingType: String,
  dietaryRequirements: [String]
});

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    pp: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    address: [addressSchema],
    preferences: preferencesSchema,
    loyaltyPoints: {
      type: Number,
      default: 0
    },
    orderHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }],
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Customer', customerSchema);
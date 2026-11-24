const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: true,
      trim: true
    },
    contactPerson: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    address: {
      street: String,
      city: String,
      postalCode: String
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

module.exports = mongoose.model('Supplier', supplierSchema);
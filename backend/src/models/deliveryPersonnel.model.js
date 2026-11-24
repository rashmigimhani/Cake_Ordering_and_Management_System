const mongoose = require('mongoose');

const deliveryPersonnelSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'On Delivery', 'Off Duty'],
      default: 'Available'
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

module.exports = mongoose.model('DeliveryPersonnel', deliveryPersonnelSchema);
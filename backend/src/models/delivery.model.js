const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    deliveryPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryPersonnel',
      required: true
    },
    status: {
      type: String,
      enum: ['Assigned', 'Out for Delivery', 'Delivered', 'Failed'],
      default: 'Assigned'
    },
    deliveryDate: {
      type: Date,
      required: true
    },
    notes: {
      type: String
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

module.exports = mongoose.model('Delivery', deliverySchema);
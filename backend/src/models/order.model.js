const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    cakeType: {
      type: String,
      required: true
    },
    flavor: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    theme: {
      type: String
    },
    eventDate: {
      type: Date,
      required: true
    },
    customImageUrl: {
      type: String
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Progress', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    deliveryMethod: {
      type: String,
      enum: ['Pickup', 'Delivery'],
      required: true
    },
    deliveryAddress: {
      street: String,
      city: String,
      postalCode: String
    },
    totalPrice: {
      type: Number,
      required: true
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
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

module.exports = mongoose.model('Order', orderSchema);
const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    deleteStatus: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["urgent", "middle", "normal"],
      default: "normal",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupportTicket", supportTicketSchema);

const { Schema, model } = require("mongoose");

const ShippingSchema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: "orders", // Reference to the OrderModel
    required: [true, "Order ID is required"],
  },
  address: {
    type: String,
    required: [true, "Shipping address is required"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  postCode: {
    type: String,
    required: [true, "Post code is required"],
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the `updatedAt` field before saving
ShippingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const ShippingModel = model("shippings", ShippingSchema);
module.exports = ShippingModel;

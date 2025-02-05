const { Schema, model } = require("mongoose");

const PaymentSchema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: "orders", // Reference to the OrderModel
    required: [true, "Order ID is required"],
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "stripe"],
    required: [true, "Payment method is required"],
  },
  amount: {
    type: Number,
    required: [true, "Payment amount is required"],
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  transactionId: {
    type: String,
    required: [true, "Transaction ID is required"],
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
PaymentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const PaymentModel = model("payments", PaymentSchema);
module.exports = PaymentModel;

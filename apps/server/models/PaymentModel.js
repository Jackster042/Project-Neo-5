const { Schema, model } = require("mongoose");
const AppError = require("../utils/AppError");

const PaymentSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "orders",
      required: [true, "Order ID is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "stripe"],
      required: [true, "Payment method is required"],
    },
    currency: {
      type: String,
      enum: ["EUR", "USD", "GBP"],
      default: "EUR",
      uppercase: true,
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      unique: true,
    },
    refundDetails: {
      isRefunded: {
        type: Boolean,
        default: false,
      },
      refundAmount: {
        type: Number,
        default: 0,
      },
      refundDate: Date,
      refundReason: String,
      refundTransactionId: String,
    },
    paymentProvider: {
      type: String,
      required: true,
      enum: ["stripe", "paypal"],
    },
    billingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
    errorMessage: String,
  },
  {
    timestamps: true,
  }
);

// Validate if amount matches order total
PaymentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const order = await this.model("orders").findById(this.order);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    if (Math.abs(this.amount - order.totalPrice) > 0.01) {
      return next(
        new AppError("Payment amount does not match order total", 400)
      );
    }
  }
  next();
});

// Update order payment status when payment status changes
PaymentSchema.post("save", async function () {
  if (this.isModified("status")) {
    await this.model("orders").findByIdAndUpdate(this.order, {
      paymentStatus: this.status,
    });
  }
});

// Index for faster queries
// PaymentSchema.index({ order: 1, status: 1 });
// PaymentSchema.index({ transactionId: 1 });
// PaymentSchema.index({ user: 1 });

const PaymentModel = model("payments", PaymentSchema);
module.exports = PaymentModel;

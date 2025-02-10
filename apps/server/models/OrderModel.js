const { Schema, model } = require("mongoose");
const AppError = require("../utils/AppError");

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Used ID is required"],
    },
    userEmail: {
      type: String,
      required: [true, "Email is required"], // USEFUL FOR NOTIFICATION
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: [true, "Product ID is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required"],
          min: 1,
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
          min: 0,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: 0,
    },
    // OBJECT INSTEAD OF STRING FOR BETTER FLEXIBILITY
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "stripe"],
      required: [true, "Payment method is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: {
      type: String,
      default: null,
    },
    cancelReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.pre("save", function (next) {
  const calculatedTotal = this.products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (Math.abs(this.totalPrice - calculatedTotal) > 0.01) {
    next(new AppError("Total price does not match calculated value", 409));
  }
  next();
});

const OrderModel = model("orders", OrderSchema);
module.exports = OrderModel;

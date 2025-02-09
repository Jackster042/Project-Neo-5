const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Used ID is required"],
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
    shippingAddress: {
      type: String,
      required: [true, "Shipping address is required"],
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
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
  }
);

// OrderSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

const OrderModel = model("orders", OrderSchema);
module.exports = OrderModel;

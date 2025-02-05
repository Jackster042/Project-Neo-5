const { Schema, model } = require("mongoose");

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users", // Reference to the UserModel
    required: [true, "User ID is required"],
    unique: true, // Each user can have only one cart
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "products", // Reference to the ProductModel
        required: [true, "Product ID is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
        min: 1,
      },
    },
  ],
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
CartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const CartModel = model("carts", CartSchema);
module.exports = CartModel;

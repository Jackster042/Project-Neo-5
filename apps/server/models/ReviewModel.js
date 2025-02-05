const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users", // Reference to the UserModel
    required: [true, "User ID is required"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "products", // Reference to the ProductModel
    required: [true, "Product ID is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
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
ReviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const ReviewModel = model("reviews", ReviewSchema);
module.exports = ReviewModel;

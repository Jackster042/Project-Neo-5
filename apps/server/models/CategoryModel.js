const { Schema, model } = require("mongoose");

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "products", // Reference to the ProductModel
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
CategorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const CategoryModel = model("categories", CategorySchema);
module.exports = CategoryModel;

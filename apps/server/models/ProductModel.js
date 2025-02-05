const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: 0,
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  allRating: {
    type: [Number],
    default: [],
  },
});

const ProductModel = model("products", ProductSchema);
module.exports = ProductModel;

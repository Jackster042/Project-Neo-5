const ProductModel = require("../models/ProductModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await ProductModel.find({});
  // console.log(products, "products from GET ALL PRODUCTS");

  if (products.length < 1)
    return res.status(200).json({ message: "No products to display" });

  return res.status(200).json({
    status: "success",
    message: "List of all products",
    products,
  });
});

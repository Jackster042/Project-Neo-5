const catchAsync = require("../utils/catchAsync");

const CartModel = require("../models/CartModel");
const ProductModel = require("../models/ProductModel");

//=================================================//
//================   GET CART     =================//
//=================================================//

exports.getCart = catchAsync(async (req, res, next) => {
  // console.log(req.body, "req.body from GET CART");
  // console.log(req.user, "req.user from GET CART");

  const cart = await CartModel.findOne({ user: req.user._id })
    .populate({
      path: "products.product",
      select: "title price image",
    })
    .lean();

  console.log(cart, "cart from GET CART");

  if (!cart)
    return res.status(404).json({
      status: "success",
      message: "No items in cart",
      cart: { user: req.user._id, products: [] },
    });

  return res.status(200).json({
    status: "success",
    message: "Cart retrieved successfully",
    cart: { ...cart, products: cart.products || [] },
  });
});

//=================================================//
//==============   ADD TO CART     =================//
//=================================================//

exports.addToCart = catchAsync(async (req, res, next) => {
  console.log(req.body, "req.body ADD TO CART");
  console.log(req.user, "req.user");

  const { productID, quantity } = req.body;

  if (!productID || quantity < 1)
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid productID & quantity" });

  // Get product price from database
  const product = await ProductModel.findById(productID);
  if (!product) {
    return res.status(404).json({
      status: "fail",
      message: "Product not found",
    });
  }

  let cart = await CartModel.findOne({ user: req.user._id });

  if (!cart)
    cart = new CartModel({
      user: req.user._id,
      products: [],
    });

  const productIndex = cart.products.findIndex(
    (p) => p.product.toString() === productID
  );

  if (productIndex > -1) {
    cart.products[productIndex].quantity = Math.max(
      cart.products[productIndex].quantity + quantity,
      1
    );
  } else {
    cart.products.push({
      product: productID,
      quantity,
      price: product.price, // Add the product price to cart item
    });
  }

  const updatedCart = await cart.save();

  const populatedCart = await CartModel.findById(updatedCart._id).populate({
    path: "products.product",
    select: "title price image",
  });

  console.log("✅ Updated Cart:", populatedCart);

  return res.status(200).json({
    status: "success",
    message: "Product added to cart",
    cart: populatedCart,
  });
});

//=================================================//
//============   REMOVE FROM CART     =============//
//=================================================//

exports.removeFromCart = catchAsync(async (req, res, next) => {
  console.log(
    req.params.productID,
    "req.params.productID from REMOVE ITEM FROM CART"
  );
  console.log(req.user, "req.user fom REMOVE ITEMS FOM CART");

  let cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) return res.status(400).json({ message: "Cart not found" });

  const productIndex = cart.products.findIndex(
    (p) => p.product.toString() === req.params.productID
  );

  if (productIndex === -1)
    return res
      .status(404)
      .json({ status: "fail", message: "Item not found in cart" });

  cart.products.splice(productIndex, 1);
  const updatedCart = await cart.save();

  const populatedCart = await CartModel.findById(updatedCart._id).populate({
    path: "products.product",
    select: "title price image",
  });

  console.log("✅ Updated Cart:", populatedCart);

  return res.status(200).json({
    status: "success",
    message: "Item removed from cart",
    cart: populatedCart,
  });
});

//=================================================//
//==============   CLEAR CART     =================//
//=================================================//

exports.clearCart = catchAsync(async (req, res, next) => {
  // FIND ONE RETURNS DELETED DOCUMENT
  // await CartModel.findOneAndDelete({ user: req.user._id });

  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart)
    return res.status(404).json({
      status: "fail",
      message: "Cart not found",
    });

  cart.products = [];
  await cart.save();

  return res.status(200).json({
    status: "success",
    message: "Products deleted from cart",
    cart,
  });
});

// TODO: CHECK FOR FILTER METHOD
/* 

  cart.products = cart.products.filter(
    (p) => p.product.toString() !== req.params.productID
  );

*/

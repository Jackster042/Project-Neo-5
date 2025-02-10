const catchAsync = require("../utils/catchAsync");

const CartModel = require("../models/CartModel");

exports.getCart = catchAsync(async (req, res, next) => {
  // console.log(req.body, "req.body from GET CART");
  // console.log(req.user, "req.user from GET CART");

  const cart = await CartModel.findOne({ user: req.user._id })
    .populate({
      path: "products.product",
      select: "title price image",
    })
    .lean();

  // console.log(cart, "cart from GET CART");

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

exports.addToCart = catchAsync(async (req, res, next) => {
  console.log(req.body, "req.body ADD TO CART");
  console.log(req.user, "req.user");

  // DESTRUCT FROM FEQ.BODY PRODUCT_ID & QUANTITY
  const { productID, quantity } = req.body;

  if (!productID || quantity < 1)
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid productID & quantity" });

  let cart = await CartModel.findOne({ user: req.user._id });
  console.log(cart, "cart from ADD TO CART");

  // TODO:  TEST RETURN IF NO CART
  // if (!cart)
  //   return res.status(404).json({
  //     message: "No carts found",
  //     cart: null,
  //   });

  // IF NO CART IN DATABASE, CREATE EMPTY CART
  if (!cart)
    cart = new CartModel({
      user: req.user._id,
      products: [],
    });

  const productIndex = cart.products.findIndex(
    (p) => p.product.toString() === productID
  );
  // console.log(productIndex, "productIndex");

  if (productIndex > -1) {
    cart.products[productIndex].quantity = Math.max(
      cart.products[productIndex].quantity + quantity,
      1
    );
  } else {
    cart.products.push({ product: productID, quantity });
  }

  const updatedCart = await cart.save();
  console.log(updatedCart, "updatedCart");

  // TODO: TEST IN POSTMAN, TO SEE IF FINBYID WILL THROW ERROR
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

  // ==================================//

  // // LOOP THROUGH PRODUCTS ARRAY IN CART
  // const productExists = cart.products.find(
  //   (p) => p.product.toString() === productID
  // );
  // // IF PRODUCT IN CART, ADD QUANTITY
  // if (productExists) {
  //   productExists.quantity += quantity;
  //   // IF CART EMPTY, USE PUSH TO ADD PRODUCT IN CART
  // } else {
  //   cart.products.push({ product: productID, quantity });
  // }

  // ========================================//

  // //  SAVE CART
  // const newCart = await cart.save();
  // console.log(newCart, "newCart");

  // // RETURN MESSAGE AND CART OBJECTs
  // res
  //   .status(200)
  //   .json({ status: "success", message: "Product added to cart", cart });

  // res.send("Hello from ADD TO CART");
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  let cart = await CartModel.findOne({ user: req.user._id });
  // console.log(cart, "cart from DELETE PRODUCT FROM CART");
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  // TODO: CHECK FOR FILTER METHOD
  cart.products = cart.products.filter(
    (p) => p.product.toString() !== req.params.productID
  );

  // console.log(cartItem, "cartItem");

  const newCart = await cart.save();
  // console.log(newCart, "newCart");

  return res.status(200).json({
    status: "success",
    message: "Successfully removed item from cart",
    cart: newCart,
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  await CartModel.findOneAndDelete({ user: req.user._id });

  return res.status(200).json({
    status: "success",
    message: "Cart cleared",
  });
});

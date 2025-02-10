const OrderModel = require("../models/OrderModel");
const PaymentModel = require("../models/PaymentModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getOrder = catchAsync(async (req, res, next) => {
  res.send("Hello from ORDERS");
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { products, shippingAddress, paymentMethod } = req.body;

  const order = await OrderModel.create({
    user: req.user._id,
    userEmail: req.user.email,
    products,
    shippingAddress,
    paymentMethod,
    totalPrice: products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
  });

  res.status(201).json({
    status: "success",
    data: { order },
  });
});

exports.getOrders = catchAsync(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user._id })
    .populate("products.product")
    .sort("-createdAt");

  res.json({
    status: "success",
    data: { orders },
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await OrderModel.findOne({
    _id: req.params.orderId,
    user: req.user._id,
  }).populate("products.product");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.json({
    status: "success",
    data: { order },
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderStatus } = req.body;

  const order = await OrderModel.findOneAndUpdate(
    { _id: req.params.orderId, user: req.user._id },
    { orderStatus },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.json({
    status: "success",
    data: { order },
  });
});

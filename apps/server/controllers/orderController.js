const OrderModel = require("../models/OrderModel");
const PaymentModel = require("../models/PaymentModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// exports.getOrder = catchAsync(async (req, res, next) => {
//   res.send("Hello from ORDERS");
// });

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
  console.log(req.user, "req.user");

  const orders = await OrderModel.find({ user: req.user._id })
    .populate("products.product")
    .sort("-createdAt");
  console.log(orders, "orders from GET ORDERS");

  res.json({
    status: "success",
    orders,
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  if (!req.params.orderID) {
    return next(new AppError("Order ID is required", 400));
  }
  const order = await OrderModel.findOne({
    _id: req.params.orderID,
    user: req.user._id,
  }).populate("products.product");
  console.log(order, "order");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.json({
    status: "success",
    order,
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderStatus } = req.body;
  console.log(orderStatus, "orderStatus");

  const order = await OrderModel.findOneAndUpdate(
    { _id: req.params.orderID, user: req.user._id },
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

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await OrderModel.findOne({
    _id: req.params.orderID,
    user: req.user._id,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if order can be cancelled
  if (!["pending", "processing"].includes(order.orderStatus)) {
    return next(
      new AppError(
        "Order cannot be cancelled. Only pending or processing orders can be cancelled",
        400
      )
    );
  }

  if (order.paymentStatus === "completed") {
    // If payment is completed, initiate refund
    const payment = await PaymentModel.findOne({ order: order._id });

    if (payment) {
      // Update payment status
      payment.status = "refunded";
      payment.refundDetails = {
        isRefunded: true,
        refundAmount: payment.amount,
        refundDate: new Date(),
        refundReason: "Order cancelled by customer",
        refundTransactionId: `ref_${Date.now()}`, // You'll want to generate this properly
      };
      await payment.save();
    }
  }

  // Update order status
  order.orderStatus = "cancelled";
  await order.save();

  res.json({
    status: "success",
    message: "Order cancelled successfully",
    data: { order },
  });
});

const OrderModel = require("../models/OrderModel");
const ShippingModel = require("../models/ShippingModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.updateShippingStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { trackingNumber, status, carrier } = req.body;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  const shipping = await ShippingModel.findOneAndUpdate(
    { order: orderId },
    {
      trackingNumber,
      status,
      carrier,
      lastUpdated: Date.now(),
    },
    { new: true, runValidators: true }
  );

  // Update order status if needed
  if (status === "delivered") {
    order.orderStatus = "delivered";
    await order.save();
  }

  res.json({
    status: "success",
    data: { shipping },
  });
});

exports.getShippingDetails = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const shipping = await ShippingModel.findOne({ order: orderId });
  if (!shipping) {
    return next(new AppError("Shipping details not found", 404));
  }

  res.json({
    status: "success",
    data: { shipping },
  });
});

// Calculate shipping rates (example with fixed rates)
exports.calculateShippingRate = catchAsync(async (req, res, next) => {
  const { address, items } = req.body;

  // Example shipping rate calculation
  const baseRate = 10;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const additionalItemRate = Math.max(0, itemCount - 1) * 2;

  const shippingRate = baseRate + additionalItemRate;

  res.json({
    status: "success",
    data: {
      rate: shippingRate,
      currency: "EUR",
      estimatedDays: "3-5",
    },
  });
});

// Validate address and get shipping options
exports.validateAddress = catchAsync(async (req, res, next) => {
  const { address } = req.body;

  // Add address validation logic here
  const isValid = true; // Replace with actual validation

  if (!isValid) {
    return next(new AppError("Invalid shipping address", 400));
  }

  // Example shipping options
  const shippingOptions = [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 10,
      currency: "EUR",
      estimatedDays: "3-5",
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 25,
      currency: "EUR",
      estimatedDays: "1-2",
    },
  ];

  res.json({
    status: "success",
    data: {
      isValid,
      options: shippingOptions,
    },
  });
});

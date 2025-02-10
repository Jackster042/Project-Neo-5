const catchAsync = require("../utils/catchAsync");

exports.getOrder = catchAsync(async (req, res, next) => {
  res.send("Hello from ORDERS");
});

exports.createOrder = catchAsync(async (req, res, next) => {
  res.send("Hello from CREATE ORDER");
});

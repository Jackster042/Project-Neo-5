const catchAsync = require("../utils/catchAsync");

exports.processPayment = catchAsync(async (req, res, next) => {
  res.send("Hello from PAYMENT");
});

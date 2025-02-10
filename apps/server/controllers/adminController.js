const OrderModel = require("../models/OrderModel");
const PaymentModel = require("../models/PaymentModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.admin = async (req, res, next) => {
  res.send("Hello from ADMIN CONTROLLER");
};

// Optional: Add admin-only cancellation with reason
exports.adminCancelOrder = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const order = await OrderModel.findById(req.params.orderID);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (!["pending", "processing"].includes(order.orderStatus)) {
    return next(
      new AppError(
        "Order cannot be cancelled. Only pending or processing orders can be cancelled",
        400
      )
    );
  }

  // Update order status with admin reason
  order.orderStatus = "cancelled";
  order.cancelReason = reason;
  await order.save();

  // If payment exists, handle refund
  if (order.paymentStatus === "completed") {
    const payment = await PaymentModel.findOne({ order: order._id });
    if (payment) {
      payment.status = "refunded";
      payment.refundDetails = {
        isRefunded: true,
        refundAmount: payment.amount,
        refundDate: new Date(),
        refundReason: reason || "Cancelled by admin",
        refundTransactionId: `ref_${Date.now()}`,
      };
      await payment.save();
    }
  }

  res.json({
    status: "success",
    message: "Order cancelled by admin",
    data: { order },
  });
});

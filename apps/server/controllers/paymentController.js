const PaymentModel = require("../models/PaymentModel");
const OrderModel = require("../models/OrderModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;

  const order = await OrderModel.findOne({
    _id: orderId,
    user: req.user._id,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Create Stripe Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.totalPrice * 100, // convert to cents
    currency: "eur",
    metadata: { orderId: order._id.toString() },
  });

  res.json({
    status: "success",
    clientSecret: paymentIntent.client_secret,
  });
});

exports.handlePaymentWebhook = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    await PaymentModel.create({
      order: paymentIntent.metadata.orderId,
      user: req.user._id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: "completed",
      transactionId: paymentIntent.id,
      paymentProvider: "stripe",
      paymentMethod: "credit_card",
    });
  }

  res.json({ received: true });
});

exports.getPaymentsByOrder = catchAsync(async (req, res, next) => {
  const payments = await PaymentModel.find({
    order: req.params.orderId,
    user: req.user._id,
  });

  res.json({
    status: "success",
    data: { payments },
  });
});

exports.processRefund = catchAsync(async (req, res, next) => {
  const { paymentId } = req.params;
  const { amount, reason } = req.body;

  const payment = await PaymentModel.findOne({
    _id: paymentId,
    user: req.user._id,
  });

  if (!payment) {
    return next(new AppError("Payment not found", 404));
  }

  // Process refund with Stripe
  const refund = await stripe.refunds.create({
    payment_intent: payment.transactionId,
    amount: amount * 100,
  });

  // Update payment record
  payment.refundDetails = {
    isRefunded: true,
    refundAmount: amount,
    refundDate: new Date(),
    refundReason: reason,
    refundTransactionId: refund.id,
  };
  payment.status = "refunded";
  await payment.save();

  res.json({
    status: "success",
    data: { payment },
  });
});

const PaymentModel = require("../models/PaymentModel");
const OrderModel = require("../models/OrderModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");

exports.createPaymentIntent = catchAsync(async (req, res, next) => {
  const { orderID } = req.body;

  const order = await OrderModel.findOne({
    _id: orderID,
    user: req.user._id,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Create Stripe Payment Intent with more metadata
  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.totalPrice * 100,
    currency: "eur",
    metadata: {
      orderId: order._id.toString(),
      userId: req.user._id.toString(),
    },
  });

  res.json({
    status: "success",
    clientSecret: paymentIntent.client_secret,
  });
});

exports.handlePaymentWebhook = catchAsync(async (req, res) => {
  console.log("\n🔄 Starting Webhook Processing");

  // Log raw data
  const rawBody = req.body;
  const signature = req.headers["stripe-signature"];

  console.log("Signature:", signature);
  console.log(
    "Webhook Secret:",
    process.env.STRIPE_WEBHOOK_SECRET?.slice(0, 10) + "..."
  );

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("\n✅ Webhook Verified:", event.type);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      console.log("🔹 Payment Intent Metadata:", paymentIntent.metadata);

      // Add transaction
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Find order first
        const order = await OrderModel.findById(
          paymentIntent.metadata.orderId
        ).session(session);

        if (!order) {
          throw new Error(`Order ${paymentIntent.metadata.orderId} not found`);
        }

        // Create payment record
        const payment = await PaymentModel.create(
          [
            {
              order: order._id,
              user: paymentIntent.metadata.userId,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency,
              status: "completed",
              transactionId: paymentIntent.id,
              paymentProvider: "stripe",
              paymentMethod: "credit_card",
            },
          ],
          { session }
        );

        // ✅ Correct way to update order inside a transaction
        const updatedOrder = await OrderModel.findByIdAndUpdate(
          order._id,
          {
            paymentStatus: "completed",
            orderStatus: "processing",
          },
          { new: true, runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();
        console.log("✅ Transaction committed successfully");

        return res.json({
          received: true,
          order: updatedOrder._id,
          payment: payment[0]._id,
        });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("❌ Transaction failed:", error);
        throw error;
      }
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    return res.status(400).json({ error: err.message });
  }
});

exports.getPaymentsByOrder = catchAsync(async (req, res, next) => {
  const payments = await stripe.charges.list({
    limit: 10, // Adjust as needed
  });

  console.log(payments.data, "payments from STRIPE");

  res.json({
    status: "success",
    payments, // Stripe returns payments in "data" array
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

exports.testWebhook = catchAsync(async (req, res) => {
  console.log("Webhook Secret:", process.env.STRIPE_WEBHOOK_SECRET);
  console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);

  res.json({
    webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
  });
});

// Add a test route for manual confirmation (for testing only)
exports.testConfirmPaymentIntent = catchAsync(async (req, res) => {
  try {
    // Payment Intent ID you want to simulate the success for
    const paymentIntentId = "pi_3QrRQdFtsmERsX7M1wDNMlLP"; // Replace with your actual payment intent ID

    // Confirm the payment intent to trigger the payment_intent.succeeded event
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    console.log("Payment Intent confirmed:", paymentIntent);

    // Return the payment intent details
    return res.json({
      message: "Payment intent confirmed successfully.",
      paymentIntent,
    });
  } catch (err) {
    console.error("Error confirming payment intent:", err);
    return res.status(500).json({ error: err.message });
  }
});

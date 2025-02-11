const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables BEFORE creating Stripe instance
dotenv.config({ path: ".env.test" });

// Now create Stripe instance after env vars are loaded
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const OrderModel = require("../models/OrderModel");
const PaymentModel = require("../models/PaymentModel");

const testOrderFlow = async () => {
  try {
    // Verify Stripe key is loaded
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to MongoDB");

    // 1. Create a test order
    console.log("\n1. Creating test order...");
    const order = await OrderModel.create({
      user: "65f1f2d76c2f6a1234567890", // Replace with a valid user ID
      userEmail: "test@example.com",
      products: [
        {
          product: "65f1f2d76c2f6a1234567891", // Replace with a valid product ID
          quantity: 2,
          price: 99.99,
        },
      ],
      totalPrice: 199.98,
      shippingAddress: {
        street: "123 Test St",
        city: "Test City",
        state: "Test State",
        zip: "12345",
        country: "Test Country",
      },
      paymentMethod: "stripe",
    });
    console.log("✅ Order created:", order._id);

    // 2. Create a payment intent
    console.log("\n2. Creating payment intent...");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: "eur",
      metadata: {
        orderId: order._id.toString(),
        userId: order.user.toString(),
      },
    });
    console.log("✅ Payment intent created:", paymentIntent.id);

    // 3. Simulate successful payment
    console.log("\n3. Simulating payment success...");
    try {
      // Create payment record
      const payment = await PaymentModel.create({
        order: order._id,
        user: order.user,
        amount: order.totalPrice,
        currency: "EUR",
        status: "completed",
        transactionId: paymentIntent.id,
        paymentProvider: "stripe",
        paymentMethod: "credit_card",
        billingAddress: {
          street: "123 Test St",
          city: "Test City",
          state: "Test State",
          zip: "12345",
          country: "Test Country",
        },
      });
      console.log("✅ Payment record created:", payment._id);

      // Update order status
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        order._id,
        {
          paymentStatus: "completed",
          orderStatus: "processing",
        },
        { new: true }
      );
      console.log("✅ Order status updated:", {
        paymentStatus: updatedOrder.paymentStatus,
        orderStatus: updatedOrder.orderStatus,
      });
    } catch (error) {
      console.error("❌ Error processing payment:", error);
    }

    // 4. Verify final state
    console.log("\n4. Verifying final state...");
    const finalOrder = await OrderModel.findById(order._id);
    const finalPayment = await PaymentModel.findOne({ order: order._id });

    console.log("\nFinal Order State:", {
      orderId: finalOrder._id,
      paymentStatus: finalOrder.paymentStatus,
      orderStatus: finalOrder.orderStatus,
    });

    console.log("\nFinal Payment State:", {
      paymentId: finalPayment._id,
      status: finalPayment.status,
      transactionId: finalPayment.transactionId,
    });

    // Cleanup
    console.log("\nCleaning up...");
    await OrderModel.findByIdAndDelete(order._id);
    await PaymentModel.findByIdAndDelete(finalPayment._id);
    console.log("✅ Test data cleaned up");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nTest completed, database connection closed");
  }
};

// Run the test
testOrderFlow();

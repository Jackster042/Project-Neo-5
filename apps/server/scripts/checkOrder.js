const mongoose = require("mongoose");
const dotenv = require("dotenv");
const OrderModel = require("../models/OrderModel");

dotenv.config({ path: ".env.test" });

const checkOrder = async (orderId) => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to MongoDB");

    const order = await OrderModel.findById(orderId);
    console.log("Order Status:", {
      id: order._id,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      updatedAt: order.updatedAt,
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
  }
};

// Usage: node scripts/checkOrder.js orderId
checkOrder(process.argv[2]);

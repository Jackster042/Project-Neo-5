const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");

// UTILS
const AppError = require("./utils/AppError.js");

// ROUTES IMPORTS
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const shippingRoutes = require("./routes/shippingRoutes.js");

// CONTROLLERS
const errorController = require("./controllers/errorController");
const paymentController = require("./controllers/paymentController.js");

const app = express();

// MIDDLEWARES
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handlePaymentWebhook
);
app.use(express.json());
app.use(logger("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));

//  DEFAULT ROUTES
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/shipping", shippingRoutes);

// 404 HANDLER
app.use("*", (req, res) => {
  return next(new AppError(`Page ${req.originalUrl} not found`, 404));
});

//  GLOBAL ERROR HANDLER
app.use(errorController);

module.exports = app;

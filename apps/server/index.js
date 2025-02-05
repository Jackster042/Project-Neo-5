const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");

// UTILS
const AppError = require("./utils/AppError.js");

// ROUTES IMPORTS
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

// CONTROLLERS
const errorController = require("./controllers/errorController");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(logger("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));

//  DEFAULT ROUTES
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/admin", adminRoutes);

// 404 HANDLER
app.use("*", (req, res) => {
  return next(new AppError(`Page ${req.originalUrl} not found`, 404));
});

//  GLOBAL ERROR HANDLER
app.use(errorController);

module.exports = app;

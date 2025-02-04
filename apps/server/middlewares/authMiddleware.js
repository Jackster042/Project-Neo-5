const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.config.js");
const catchAsync = require("../utils/catchAsync");

exports.authenticate = catchAsync(async (req, res, next) => {
  // 1. Extract token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Fix: Add space after 'Bearer'
  if (!token) {
    return next(new AppError("Please log in to access this resource", 401));
  }

  // 2. Verify the token
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded; // Attach the decoded user data to the request object

  // 3. Log the decoded user data for debugging
  console.log("Decoded user:", decoded);

  // 4. Proceed to the next middleware or route handler
  next();
});

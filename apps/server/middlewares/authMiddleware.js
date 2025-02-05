const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.config.js");
const catchAsync = require("../utils/catchAsync");
const UserModel = require("../models/UserModel.js");

exports.authenticate = catchAsync(async (req, res, next) => {
  // 1. Extract token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Fix: Add space after 'Bearer'
  // console.log(token, "token AUTHENTICATE");

  if (!token) {
    return next(new AppError("Please log in to access this resource", 401));
  }

  // 2. Verify the token
  let decoded; // Attach the decoded user data to the request object
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    // 3. Log the decoded user data for debugging
    console.log("Decoded user:", decoded);
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
  // 4. Fetch user from DataBase
  const user = await UserModel.findById(decoded._id);
  if (!user) return next(new AppError("User no longer exists", 404));

  // 5.Attach user to request
  req.user = user;
  // 6. Proceed to the next middleware or route handler
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("User is not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

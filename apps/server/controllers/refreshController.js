const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

// UTILS
const AppError = require("../utils/AppError");
const {
  JWT_REFRESH_SECRET,
  JWT_SECRET,
  JWT_OPTIONS,
} = require("../config/env.config");

exports.refreshToken = async (req, res, next) => {
  // 1. Check if the refresh token is provided
  const { refreshToken } = req.body;

  if (!refreshToken)
    return next(new AppError("Refresh token is required", 403));

  // 2. Verify the refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    console.log(decoded, "decoded");
  } catch (err) {
    return next(new AppError("Invalid or expired refresh token", 401));
  }

  // 3. Find the user by the decoded user ID
  const user = await UserModel.findById(decoded._id);
  console.log(user, "user REFRESH");
  //   console.log(refreshToken, "refreshToken");

  if (!user || user.refreshToken !== refreshToken) {
    return next(new AppError("Invalid refresh token", 401));
  }

  // TOKEN PAYLOAD
  let payload = {
    _id: user.id,
    role: user.role,
  };

  // 4. Generate a new access token
  const accessToken = jwt.sign(payload, JWT_SECRET, JWT_OPTIONS);
  // 5. Send the new access token in the response
  return res.status(200).json({
    status: "success",
    message: "Access token refreshed",
    accessToken,
  });
};

const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

// UTILS
const Email = require("../utils/sendEmail.js");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// CONFIG ENV
const { JWT_SECRET, JWT_OPTIONS } = require("../config/env.config.js");

// ========================
// ======= REGISTER =======
// ========================
exports.register = catchAsync(async (req, res, next) => {
  //   console.log(req.body, "req.body  REGISTER");

  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    const newUser = new UserModel(req.body);
    const savedUser = await newUser.save();
    // console.log(savedUser, "savedUser");

    // TODO: SEND EMAIL TO USER
    await new Email(
      { email: savedUser.email, username: savedUser.username },
      "http://localhost:4000"
    ).sendWelcome();

    return res.status(200).json({
      status: "success",
      message: "successfully registered",
    });
  } else {
    return next(new AppError("User with this email already exists", 409));
  }
});

// ========================
// ======= LOGIN =======
// ========================
exports.login = catchAsync(async (req, res, next) => {
  // console.log(req.body, "req.body LOGIN");
  const user = await UserModel.findOne({ email: req.body.email }).select(
    "+password"
  );
  // console.log(user, "user   backed LOGIN");
  if (!user)
    return next(
      new AppError("Don't have account, proceed to Register page"),
      409
    );

  const isCorrectPassword = await user.isCorrectPassword(
    req.body.password,
    user.password
  );

  if (!isCorrectPassword) return next(new AppError("Invalid credentials", 401));
  // console.log(isCorrectPassword, "isCorrectedPassword");

  let payload = {
    _id: user.id,
    role: user.role,
    // createdAd: new Date().toString()
  };
  // console.log(payload, "payload");

  let token = jwt.sign(payload, JWT_SECRET, JWT_OPTIONS);
  // console.log(token, "token");

  const { password: _, __v, ...userData } = user.toObject();
  console.log(userData, "userData");

  return res.status(200).json({
    status: "success",
    message: "Successfully logged in",
    user: userData,
    token,
  });
});

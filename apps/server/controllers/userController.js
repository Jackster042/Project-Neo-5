const UserModel = require("../models/UserModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.register = catchAsync(async (req, res, next) => {
  //   console.log(req.body, "req.body  REGISTER");

  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    const newUser = new UserModel(req.body);
    const savedUser = await newUser.save();
    //   console.log(savedUser, "savedUser");

    return res.status(200).json({
      status: "success",
      message: "successfully registered",
    });
  } else {
    return next(new AppError("User with this email already exists"), 409);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body, "req.body LOGIN");
  const user = await UserModel.findOne({ email: req.body.email }).select(
    "+password"
  );
  console.log(user, "user backed LOGIN");
  if (!user)
    return next(
      new AppError("Don't have account, proceed to Register page"),
      409
    );

  const isCorrectPassword = await user.isCorrectPassword(
    req.body.password,
    user.password
  );
  // console.log(isCorrectPassword, "isCorrectedPassword");
  const { password, __v, ...userData } = user.toObject();
  // console.log(userData, "userData");

  return res.status(200).json({
    status: "success",
    message: "Successfully logged in",
    user: userData,
  });
});

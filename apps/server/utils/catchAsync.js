const AppError = require("./AppError");

module.exports = (func) => {
  return function (req, res, next) {
    func(req, res, next).catch((err) => {
      console.log(err, "catchAsync Error");

      // CHECK FOR VALIDATION ERROR MONGOOSE ERROR
      if (err.name === "ValidationError") {
        const errorMessage = Object.values(err.errors).map((el) => el.message);
        const message = errorMessage.join(". ");
        return next(new AppError(message, 400));
      }

      // MONGOOSE DUPLICATE KEY ERROR
      if (err.code === 11000) {
        const message = `Duplicate filed value: ${Object.keys(
          err.keyValue
        ).join(", ")}`;
        return next(new AppError(message, 400));
      }

      // MONGOOSE CAST ERROR
      if (err.name) {
        const message = `Invalid ${err.path}:${err.value}`;
        return next(new AppError(message, 400));
      }

      // TODO: STRIPE ERRORS

      return next(new AppError("Internal Server Error"), 500);
    });
  };
};

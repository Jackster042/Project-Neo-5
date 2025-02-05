const AppError = require("./AppError");

module.exports = (func) => {
  return function (req, res, next) {
    func(req, res, next).catch((err) => {
      console.log(err, "catchAsync Error");
      // console.log(err.name, ": err.name s");

      // CHECK FOR VALIDATION ERROR MONGOOSE ERROR
      if (err.name === "ValidationError") {
        const errorMessage = Object.values(err.errors).map((el) => el.message);

        // REMOVES DUPLICATE ERROR MESSAGES
        const uniqueMessages = [...new Set(errorMessage)];

        const message = uniqueMessages.join(". ");

        return next(new AppError(message, 400)); // 400 - BAD REQUEST
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

      // JWT TOKEN ERRORS
      if (err.name === "TokenExpiredError") {
        return next(
          new AppError("Your session has expired. Please log in again.", 401)
        );
      }
      if (err.name === "JsonWebTokenError") {
        return next(new AppError("Invalid token. Please log in again.", 401));
      }

      // TODO: STRIPE ERRORS

      return next(new AppError("Internal Server Error"), 500);
    });
  };
};

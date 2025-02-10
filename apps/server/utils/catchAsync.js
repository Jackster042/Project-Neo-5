const AppError = require("./AppError");

module.exports = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.log("Error caught in catchAsync:", err);

      // Mongoose Validation Error
      if (err.name === "ValidationError") {
        const errorMessage = Object.values(err.errors)
          .map((el) => el.message)
          .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
          .join(". ");

        return next(new AppError(errorMessage, 400));
      }

      // Mongoose Duplicate Key Error
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(", ");
        return next(new AppError(`Duplicate value for: ${field}`, 400));
      }

      // Mongoose Cast Error
      if (err.name === "CastError") {
        return next(new AppError(`Invalid ${err.path}: ${err.value}`, 400));
      }

      // JWT Errors
      if (err.name === "TokenExpiredError") {
        return next(
          new AppError("Your session has expired. Please log in again.", 401)
        );
      }
      if (err.name === "JsonWebTokenError") {
        return next(new AppError("Invalid token. Please log in again.", 401));
      }

      // Stripe Errors
      if (err.type === "StripeCardError") {
        return next(new AppError(err.message, 400));
      }
      if (err.type === "StripeInvalidRequestError") {
        return next(new AppError("Invalid payment request", 400));
      }

      // Default error
      return next(
        new AppError(err.message || "Something went wrong", err.status || 500)
      );
    }
  };
};

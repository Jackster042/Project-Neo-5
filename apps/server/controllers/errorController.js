const sendErrorDev = (err, res, req, next) => {
  // Use proper logging instead of console.log
  console.error("[Development Error]:", err);

  res.status(err.statusCode).json({
    err: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res, next) => {
  // Log error in production but don't expose to client
  console.error("[Production Error]:", err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: "error",
      message: "Internal Server Error!",
    });
  }
};

const sendErrorTest = (err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      err: err,
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  } else if (process.env.NODE_ENV === "test") {
    sendErrorTest(err, res);
  }
};

// / Normalize error object
// const normalizeError = (err) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   return err;
// };

// module.exports = (err, req, res, next) => {
//   const normalizedError = normalizeError(err);

//   // Fix comparison operators
//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(normalizedError, req, res, next);
//   } else if (process.env.NODE_ENV === 'production') {
//     sendErrorProd(normalizedError, req, res, next);
//   } else if (process.env.NODE_ENV === 'test') {
//     sendErrorTest(normalizedError, req, res, next);
//   }
// };

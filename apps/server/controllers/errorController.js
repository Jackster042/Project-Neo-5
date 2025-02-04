const sendErrorDev = (err, res, req, next) => {
  console.log(err, "error from ErrorController");
  // console.log(err.status, "err.status");
  // console.log(err.message, "err.message");
  // console.log(err.stack, "err.stack");

  res.status(err.statusCode).json({
    err: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res, next) => {
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

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if ((process.env.NODE_ENV = "development")) {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV_PRODUCTION) {
    sendErrorProd(err, res);
  }
};

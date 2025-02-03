const sendErrorDev = (err, res, req, next) => {
  console.log(err, "error");
  res.status(err.StatusCode).json({
    err: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.StatusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.StatusCode).json({
      status: "error",
      message: "Internal Server Error!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.StatusCode = err.StatusCode || 500;
  err.status = err.status || "error";

  if ((process.env.NODE_ENV = "development")) {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV_PRODUCTION) {
    sendErrorProd(err, res);
  }
};

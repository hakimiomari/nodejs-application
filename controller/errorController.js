const AppError = require("../utiles/AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const value =
    err.keyValue.name !== "undefined" ? err.keyValue.name : err.keyValue.email;
  const message = `Duplicate field value "${value}". Please use another value`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(" .")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const sendErrorPro = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      error: error,
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "errors";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    var error = { ...err };
    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
      sendErrorPro(error, res);
    } else if (err.code === 11000) {
      error = handleDuplicateFieldDB(error);
      sendErrorPro(error, res);
    } else if (err.name === "ValidationError") {
      error = handleValidationError(error);
      sendErrorPro(error, res);
    } else {
      sendErrorPro(err, res);
    }
  }
};

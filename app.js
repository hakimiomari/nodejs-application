const express = require("express");
const app = express();
const morgan = require("morgan");

const AppError = require("./utiles/AppError");
const globalErrorHandler = require("./controller/errorController");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRoute");

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// invalid request

app.all("*", (req, res, next) => {
  next(new AppError("Not Found", 404));
});

// Global error handling middleWare
app.use(globalErrorHandler);

module.exports = app;

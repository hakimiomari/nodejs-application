const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./../models/userModel");
const catchAsync = require("../utiles/catchAsync");
const AppError = require("./../utiles/AppError");

// token generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// signin route
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = generateToken(newUser._id);
  res.status(201).json({
    status: "success",
    token: token,
    user: {
      newUser,
    },
  });
});

// login route
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email or password is exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  // 2) check if the user is exist
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // 3) everything is ok send token
  const token = generateToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

// route protect
exports.protect = catchAsync(async (req, res, next) => {
  let token = "";
  // 1) check if token is there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not Logged in! please log in to get access", 401)
    );
  }
  // varify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if the use exist
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError("The User belong to this token does no longer exist", 401)
    );
  }
  // checking if the password is changed or not
  if (user.changePassword(decoded.iat)) {
    return next(
      new AppError("User recently changed password. Please log in again", 401)
    );
  }
  req.user = user;
  next();
});

// role of admin
exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to do this action", 403)
      );
    }
    next();
  };
};

// forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // check  user with current email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user exist with this email", 404));
  }

  // Generate the random reset token
  const resetToken = user.createResetPasswordToken();
  await user.save();

  res.status(200).json({
    status: "success",
    message: "successfully generate token",
  });
});

// reset password
exports.resetPassword = (req, res, next) => {};

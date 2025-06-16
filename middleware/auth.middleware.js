const catchAsyncError = require("./catchAsyncError");
const {ErrorHandler} = require("./error");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


const isAuthorized = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("user not authorized", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);
  next();
});

module.exports = isAuthorized;
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new Error("No authorization header", 401));
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(new Error("No token", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new Error("User not found", 404));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(new Error("Invalid token", 401));
  }
});

module.exports = authMiddleware;

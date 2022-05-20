const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// register user controller
const register = asyncHandler(async (req, res, next) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return next(
      new Error(`User with email ${req.body.email} already exists`, 400)
    );
  }
  const { firstName, lastName, email, password } = req.body;
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });
  res.status(201).json({
    success: true,
    data: user,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found", 404));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new Error("Invalid password", 401));
  }
  const token = user.generateToken();
  res.status(200).json({
    success: true,
    token,
  });
});

module.exports = { register, login };

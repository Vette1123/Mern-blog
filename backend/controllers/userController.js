const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongodbId } = require("../utils/validateMongodbID");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const { uploadFile, getFileStream } = require("../utils/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
  const token = user.generateToken();
  res.status(201).json({
    success: true,
    data: user,
    token,
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

const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    data: users,
  });
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new Error("User not found", 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new Error("User not found", 404));
  }
  await user.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new Error("User not found", 404));
  }
  const { firstName, lastName, email, bio } = req.body;
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.bio = bio;
  await user.save();
  res.status(200).json({
    success: true,
    data: user,
  });
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new Error("User not found", 404));
  }
  const { password } = req.body;
  user.password = password;
  await user.save();
  res.status(200).json({
    success: true,
    data: user,
  });
});

// follow user controller
const userFollow = asyncHandler(async (req, res, next) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  //find the target user and check if the login id exist
  const targetUser = await User.findById(followId);

  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  if (alreadyFollowing) throw new Error("You have already followed this user");

  //1. Find the user you want to follow and update it's followers field
  await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginUserId },
      isFollowing: true,
    },
    { new: true }
  );

  //2. Update the login user following field
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    { new: true }
  );
  res.json("You have successfully followed this user");
});

// unfollow user controller
const userUnfollow = asyncHandler(async (req, res, next) => {
  const { unfollowId } = req.body;
  const loginUserId = req.user.id;

  //find the target user and check if the login id exist
  const targetUser = await User.findById(unfollowId);

  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  if (!alreadyFollowing) throw new Error("You have not followed this user");

  //1. Find the user you want to follow and update it's followers field
  await User.findByIdAndUpdate(
    unfollowId,
    {
      $pull: { followers: loginUserId },
      isFollowing: false,
    },
    { new: true }
  );

  //2. Update the login user following field
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unfollowId },
    },
    { new: true }
  );
  res.json("You have successfully unfollowed this user");
});
// block a user
const blockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true }
  );
  res.json(user);
});
// unblock a user
const unblockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true }
  );
  res.json(user);
});

// account verification / send email
const generateverificationToken = asyncHandler(async (req, res, next) => {
  const loginUserId = req.user.id;
  const user = await User.findById(loginUserId);
  if (!user) {
    return next(new Error("User not found", 404));
  }
  const token = user.generateVerificationToken();
  console.log(token);
  await user.save({ validateBeforeSave: false });
  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/users/verify-email/${token}`;
  const message = `Please verify your email by clicking the link: ${url}. If you did not request this, please ignore this email.`;
  const msg = {
    to: "boogado@yahoo.com",
    from: "sadge@post.com",
    subject: "Account Verification",
    text: message,
    html: `<p>Please verify your email by clicking the link: <a href="${url}">${url}</a>. If you did not request this, please ignore this email.</p>`,
  };
  await sgMail.send(msg);
  res.status(200).json({
    success: true,
    message: message,
  });
});

// account verification / verify email
const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    accountVerificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new Error("Invalid token", 400));
  }
  user.isAccountVerified = true;
  user.accountVerificationToken = undefined;
  user.accountVerificationExpiry = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Your email has been verified",
    data: user,
  });
});
// forgot password
const forgotPasswordToken = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found", 404));
  }

  try {
    const token = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/users/reset-password/${token}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: ${url}`;
    const msg = {
      to: email,
      from: "sadge@post.com",
      subject: "Password reset",
      text: message,
      html: `<p>You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: <a href="${url}">${url}</a></p>`,
    };
    await sgMail.send(msg);
    res.status(200).json({
      success: true,
      message: "Email sent",
      data: msg,
    });
  } catch (error) {
    return next(new Error("Something went wrong", 500));
  }
});
// reset password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new Error("Invalid token", 400));
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Your password has been reset",
  });
});
// upload photos to s3
const profilePictureUpload = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  // console.log(user);
  const file = req.file;
  const result = await uploadFile(file);
  console.log(result);
  const user = await User.findByIdAndUpdate(
    id,
    {
      profilePhoto: result?.Key,
    },
    { new: true }
  );
  console.log(user);

  await unlinkFile(file.path);
  res.status(200).json({
    success: true,
    message: "Profile picture uploaded",
    data: user,
  });
});

// download photo from aws s3
const downloadProfilePicture = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    return next(new Error("User not found", 404));
  }
  const readStream = getFileStream(user.profilePhoto);
  console.log(readStream);
  readStream.pipe(res);
});

module.exports = {
  register,
  login,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  updatePassword,
  userFollow,
  userUnfollow,
  blockUser,
  unblockUser,
  generateverificationToken,
  verifyEmail,
  forgotPasswordToken,
  resetPassword,
  profilePictureUpload,
  downloadProfilePicture,
};

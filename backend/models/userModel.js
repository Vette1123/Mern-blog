const mongoose = require("mongoose");

// creating schema for user

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  profilePhoto: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  bio: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
  },
  postCount: {
    type: Number,
    default: 0,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  enum: {
    type: String,
    enum: ["Admin", "Guest", "Blogger"],
  },
  isFollowing: {
    type: Boolean,
    default: false,
  },
  isUnfollowing: {
    type: Boolean,
    default: false,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
});

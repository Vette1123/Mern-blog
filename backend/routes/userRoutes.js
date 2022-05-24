const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { profilePictureUploadMulter } = require("../middlewares/uploadPhotos");

const {
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
  forgotPasswordToken,
  resetPassword,
  verifyEmail,
  profilePictureUpload,
} = require("../controllers/userController");

router
  .post("/register", register)
  .post("/login", login)
  .post("/send-email", authMiddleware, generateverificationToken)
  .post("/forgot-password", authMiddleware, forgotPasswordToken);

router.get("/", authMiddleware, getUsers).get("/:id", authMiddleware, getUser);
router.delete("/:id", authMiddleware, deleteUser);

router
  .put("/follow", authMiddleware, userFollow)
  .put(
    "/profile-picture",
    authMiddleware,
    profilePictureUploadMulter,
    profilePictureUpload
  )
  .put("/unfollow", authMiddleware, userUnfollow)
  .put("/verify-email", authMiddleware, verifyEmail)
  .put("/reset-password", authMiddleware, resetPassword)
  .put("/block-user/:id", authMiddleware, blockUser)
  .put("/unblock-user/:id", authMiddleware, unblockUser)
  .put("/password/:id", authMiddleware, updatePassword)
  .put("/:id", authMiddleware, updateUser);

module.exports = router;

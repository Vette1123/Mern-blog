const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

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
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/userController");

router
  .post("/register", register)
  .post("/login", login)
  .post(
    "/generateverificationtoken",
    authMiddleware,
    generateverificationToken
  );
router.get("/", authMiddleware, getUsers).get("/:id", authMiddleware, getUser);
router.delete("/:id", authMiddleware, deleteUser);
router
  .put("/follow", authMiddleware, userFollow)
  .put("/unfollow", authMiddleware, userUnfollow)
  .put("/block-user/:id", authMiddleware, blockUser)
  .put("/unblock-user/:id", authMiddleware, unblockUser)
  .put("/password/:id", authMiddleware, updatePassword)
  .put("/:id", authMiddleware, updateUser);

module.exports = router;

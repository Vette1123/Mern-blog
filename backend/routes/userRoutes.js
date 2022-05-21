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
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/", authMiddleware, getUsers).get("/:id", authMiddleware, getUser);
router.delete("/:id", authMiddleware, deleteUser);
router
  .put("/follow", authMiddleware, userFollow)
  .put("/unfollow", authMiddleware, userUnfollow)
  .put("/password/:id", authMiddleware, updatePassword)
  .put("/:id", authMiddleware, updateUser);

module.exports = router;

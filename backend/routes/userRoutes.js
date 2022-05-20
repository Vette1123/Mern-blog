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
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/", authMiddleware, getUsers).get("/:id", authMiddleware, getUser);
router.delete("/:id", authMiddleware, deleteUser);
router
  .put("/:id", authMiddleware, updateUser)
  .put("/:id/password", authMiddleware, updatePassword);

module.exports = router;

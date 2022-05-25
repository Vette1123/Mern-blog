const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

router
  .get("/", authMiddleware, getComments)
  .get("/:id", authMiddleware, getComment);

router.post("/create", authMiddleware, createComment);

router.put("/:id", authMiddleware, updateComment);

router.delete("/:id", authMiddleware, deleteComment);
module.exports = router;

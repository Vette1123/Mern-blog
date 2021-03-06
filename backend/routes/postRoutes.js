const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { profilePictureUploadMulter } = require("../middlewares/uploadPhotos");
const { paginatedResults } = require("../middlewares/pagination");
const Post = require("../models/postModel");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  togglePostLike,
  togglePostDisLike,
} = require("../controllers/postController");

router
  .get("/", authMiddleware, paginatedResults(Post), getPosts)
  .get("/:id", getPost);

router.post("/create", authMiddleware, profilePictureUploadMulter, createPost);

router
  .put("/likes", authMiddleware, togglePostLike)
  .put("/dislikes", authMiddleware, togglePostDisLike)
  .put("/update/:id", authMiddleware, updatePost);

router.delete("/delete/:id", authMiddleware, deletePost);

module.exports = router;

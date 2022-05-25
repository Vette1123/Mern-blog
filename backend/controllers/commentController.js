const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

// create a comment
const createComment = asyncHandler(async (req, res, next) => {
  const { postId, description } = req.body;
  const user = await User.findById(req.user.id);
  const post = await Post.findById(postId);
  if (!post) {
    return next(new Error(`Post not found with id of ${postId}`, 404));
  }
  const comment = await Comment.create({
    description,
    user: user._id,
    post: post._id,
  });
  res.status(201).json({
    success: true,
    data: comment,
  });
});
// get all comments
const getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find().sort("-created");
  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
});
// get a comment
const getComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(
      new Error(`Comment not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: comment,
  });
});

// update a comment
const updateComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      description: req.body.description,
      post: req.body.postId,
      user: req.user.id,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!comment) {
    return next(
      new Error(`Comment not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: comment,
  });
});

// delete a comment
const deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(
      new Error(`Comment not found with id of ${req.params.id}`, 404)
    );
  }
  await comment.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
};

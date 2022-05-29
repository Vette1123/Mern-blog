const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const { uploadFile, getFileStream } = require("../utils/s3");
const Filter = require("bad-words");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

// create a post
const createPost = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.user._id}`, 404)
    );
  }
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);
  if (isProfane) {
    await user.findByIdAndUpdate(req.user.id, {
      isBlocked: true,
    });
    return next(new Error(`Profanity is not allowed`, 400));
  }
  const file = req.file;
  console.log(req);
  const result = await uploadFile(file);
  const post = await Post.create({
    ...req.body,
    user: req.user.id,
    image: result.Location,
  });
  await unlinkFile(file.path);

  res.status(201).json({
    success: true,
    data: post,
  });
});

// get all posts
const getPosts = asyncHandler(async (req, res, next) => {
  // get pagination query params

  const hasCategory = req.query.category;
  if (hasCategory) {
    res.paginatedResults.results = res.paginatedResults.results.filter(
      (post) => post.category === hasCategory
    );
    res.json(res.paginatedResults);
  } else {
    res.json(res.paginatedResults);
  }
});

// get a post
const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .populate("user");

  if (!post) {
    return next(new Error(`Post not found with id of ${req.params.id}`, 404));
  }
  // update number of views
  await Post.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { numViews: 1 },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: post,
  });
});
// update a post
const updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { ...req.body, user: req.user?.id },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!post) {
    return next(new Error(`Post not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: post,
  });
});

// delete a post
const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new Error(`Post not found with id of ${req.params.id}`, 404));
  }
  if (post.user.toString() !== req.user.id) {
    return next(
      new Error(
        `User ${req.user.id} is not authorized to delete this post`,
        401
      )
    );
  }
  await post.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});

// like a post
const togglePostLike = asyncHandler(async (req, res, next) => {
  //1.Find the post to be liked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //2. Find the login user
  const loginUserId = req?.user?._id;
  //3. Find is this user has liked this post?
  const isLiked = post?.isLiked;
  //4.Chech if this user has dislikes this post
  const alreadyDisliked = post?.disLikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  //5.remove the user from dislikes array if exists
  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(post);
  }
  //Toggle
  //Remove the user if he has liked the post
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    //add to likes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(post);
  }
});

// dislike a post
const togglePostDisLike = asyncHandler(async (req, res, next) => {
  //1.Find the post to be disLiked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //2.Find the login user
  const loginUserId = req?.user?._id;
  //3.Check if this user has already disLikes
  const isDisLiked = post?.isDisLiked;
  //4. Check if already like this post
  const alreadyLiked = post?.likes?.find(
    (userId) => userId.toString() === loginUserId?.toString()
  );
  //Remove this user from likes array if it exists
  if (alreadyLiked) {
    const post = await Post.findOneAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(post);
  }
  //Toggling
  //Remove this user from dislikes if already disliked
  if (isDisLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );
    res.json(post);
  }
});
module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  togglePostLike,
  togglePostDisLike,
};

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");

// create a new category
const createCategory = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  const newCategory = {
    title: req.body.title,
    user: user._id,
  };
  const category = await Category.create(newCategory);
  res.status(201).json({
    success: true,
    data: category,
  });
});
// get all categories
const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate("user").sort("-createdAt");
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});
// get a single category
const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate("user")
    .sort("-createdAt");
  if (!category) {
    return next(
      new Error(`Category not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});
// update a category
const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!category) {
    return next(
      new Error(`Category not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});
// delete a category
const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new Error(`Category not found with id of ${req.params.id}`, 404)
    );
  }
  category.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};

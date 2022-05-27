const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

router
  .get("/", authMiddleware, getCategories)
  .get("/:id", authMiddleware, getCategory);

router.post("/create", authMiddleware, createCategory);

router.put("/update/:id", authMiddleware, updateCategory);

router.delete("/delete/:id", authMiddleware, deleteCategory);

module.exports = router;

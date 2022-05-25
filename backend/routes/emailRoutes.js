const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { sendEmail } = require("../controllers/emailController");

router.post("/", authMiddleware, sendEmail);

module.exports = router;

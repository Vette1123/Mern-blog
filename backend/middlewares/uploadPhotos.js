const path = require("path");
const multer = require("multer");

// file type checking
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image!"), false);
  }
};
const profilePictureUploadMulter = multer({
  // dest : backend/uploads

  dest: "backend/uploads/",
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
    // 5mb
  },
}).single("image");

module.exports = { profilePictureUploadMulter };

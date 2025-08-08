const multer = require("multer");

const multerErrorHandler = (error, req, res, next) => {
  if (
    error instanceof multer.MulterError ||
    error.message === "Only image files are allowed"
  ) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
  next();
};

module.exports = multerErrorHandler;
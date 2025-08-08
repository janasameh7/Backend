const multer = require("multer")

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    const prefix = req.body.type === "book" ? "book-" : "user-"; 
    const fileName = `${prefix}${Date.now()}.${extension}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const type = file.mimetype.split("/")[0];
  if (type === "image") {
    return cb(null, true);
  }
  return cb(new Error("Only image files are allowed"), false);
};

const upload = multer({ storage: diskStorage, fileFilter: fileFilter });

module.exports = upload;
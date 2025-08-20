const multer = require("multer")

// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     const extension = file.mimetype.split("/")[1];
//     const prefix = req.body.type === "book" ? "book-" : "user-"; 
//     const fileName = `user-${Date.now()}.${extension}`;
//     cb(null, fileName);
//   },
// });

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/users");
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${extension}`;
    cb(null, fileName);
  },
});

const bookStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/books");
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    const fileName = `book-${Date.now()}.${extension}`;
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

const uploadUser = multer({ storage: userStorage, fileFilter: fileFilter });
const uploadBook = multer({ storage: bookStorage, fileFilter: fileFilter });

module.exports = { uploadUser, uploadBook };
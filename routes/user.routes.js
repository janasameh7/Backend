const express = require("express");
const userControllers = require("../controllers/user.controllers");
const {uploadUser} = require("../middlewares/upload.middlewares");
const multerErrorHandler = require("../middlewares/multer.error.handler");

const router = express.Router();
 
router.post(
  "/signup",
  uploadUser.single("photo"), multerErrorHandler, 
  userControllers.signup
);
 
router.get("/", userControllers.getAllUsers);
router.post("/login", userControllers.login);
router.post(
  "/favoriteBook",
  userControllers.protectRoutes,
  userControllers.addBookToFav
);

router.delete('/favorites/:bookId', 
  userControllers.protectRoutes, 
  userControllers.removeBookFromFav);

router.get('/favorites',
   userControllers.protectRoutes, 
   userControllers.getUserFavorites);

router.get('/favorites/:bookId/check', 
  userControllers.protectRoutes,
  userControllers.isBookInFavorites);
 
module.exports = router;
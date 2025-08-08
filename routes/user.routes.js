const express = require("express");
const userControllers = require("../controllers/user.controllers");

const upload = require("../middlewares/upload.middlewares");
const multerErrorHandler = require("../middlewares/multer.error.handler");
const router = express.Router();

router.post(
    "/signup",
    upload.single("photo"),
    multerErrorHandler,
    userControllers.signup
);

router.get("/", userControllers.getAllUsers);
router.post("/login", userControllers.login);
router.post(
    "/favoriteBook", 
    userControllers.protectRoutes,
    userControllers.addBookToFav 
);

module.exports = router;
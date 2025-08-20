const booksControllers = require("../controllers/books.controllers");
const express = require("express");
const userControllers = require("../controllers/user.controllers");
const { uploadBook } = require("../middlewares/upload.middlewares");
const multerErrorHandler = require("../middlewares/multer.error.handler");

const router = express.Router();

router.route("/")
    .post(uploadBook.single('coverImage'), multerErrorHandler, booksControllers.createBook)
    .get(booksControllers.getAllBooks);

router.route("/:id")
    .get(booksControllers.getBookById)
    .patch(userControllers.protectRoutes, uploadBook.single('coverImage'), multerErrorHandler, booksControllers.updateBook)
    .delete(userControllers.protectRoutes, booksControllers.deleteBook);

router.route("/search/author") 
    .get(booksControllers.searchBooksByAuthor); 

router.route("/search/title") 
    .get(booksControllers.searchBooksByTitle);

module.exports = router;
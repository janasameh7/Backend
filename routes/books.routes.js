const booksControllers = require("../controllers/books.controllers");
const express = require("express");
const userControllers = require("../controllers/user.controllers");


const router = express.Router();

router.route("/")
    .post(booksControllers.createBook)
    .get(booksControllers.getAllBooks);

router.route("/:id")
    .get(booksControllers.getBookById)
    .patch(booksControllers.updateBook)
    .delete(booksControllers.deleteBook);

router.route("/search/author") 
    .get(booksControllers.searchBooksByAuthor); 

module.exports = router;
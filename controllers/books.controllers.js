const Book = require("../models/books.models");
const mongoose = require("mongoose");

const createBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json({ status: "success", data: { book: book } })
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message })
    }
}

const getAllBooks = async (req, res) => {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 5;
        const skip = (page - 1) * limit;
        const books = await Book.find().skip(skip).limit(limit);

        res.status(200).json({
            status: "success",
            totalBooks: books.total,
            data: { books: books },
        })
    } catch (error) {
        res.status(404).json({ status: "fail", message: error.message });
    }
}

const getBookById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ status: "error", message: "Invalid ID" })
    }
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ status: "error", message: "Not Found" });
        }
        res.status(200).json({ status: "success", data: { book: book } });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

const updateBook = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true });
        res.status(200).json({ status: "success", data: { book: updatedBook } });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

const deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: "success", data: { book: deletedBook } });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

const searchBooksByAuthor = async (req, res) => { 
    try {
        const author = req.query.author; 
        if (!author) {
            return res.status(400).json({ status: "fail", message: "Author parameter is required" });
        }
        const books = await Book.find({ authors: { $regex: author, $options: 'i' } }); 

        res.status(200).json({
            status: "success",
            totalBooks: books.total,
            data: { books: books },
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    searchBooksByAuthor, 
};
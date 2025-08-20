const Book = require("../models/book.models");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const createBook = async (req, res) => {
    try {
        let bookData = { ...req.body };
        if (req.file) {
            bookData.coverImage = req.file.filename;
        }
        // Convert authors and genres to arrays if strings
        if (bookData.authors && typeof bookData.authors === 'string') {
            bookData.authors = bookData.authors.split(',').map(v => v.trim()).filter(v => v);
        }
        if (bookData.genres && typeof bookData.genres === 'string') {
            bookData.genres = bookData.genres.split(',').map(v => v.trim()).filter(v => v);
        }
        // Validate required fields
        if (!bookData.title || !bookData.language || !bookData.publicationYear || !bookData.authors?.length || !bookData.genres?.length || !bookData.pageCount) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
            }
            return res.status(400).json({ status: "fail", message: "Missing required fields" });
        }
        // Validate numeric and date fields
        bookData.publicationYear = Number(bookData.publicationYear);
        bookData.pageCount = Number(bookData.pageCount);
        if (bookData.ratings) bookData.ratings = Number(bookData.ratings);
        if (bookData.totalRatings) bookData.totalRatings = Number(bookData.totalRatings);
        if (bookData.createdAt) {
            const date = new Date(bookData.createdAt);
            if (isNaN(date.getTime())) {
                if (req.file) {
                    fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
                }
                return res.status(400).json({ status: "fail", message: "Invalid createdAt date" });
            }
            bookData.createdAt = date;
        }
        const book = await Book.create(bookData);
        res.status(201).json({ status: "success", data: { book } });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
        }
        console.error('Error in createBook:', error);
        res.status(400).json({ status: "fail", message: error.message });
    }
};

const getAllBooks = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    const books = await Book.find().skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments();
    res.status(200).json({
      status: "success",
      totalBooks,
      data: { books }
    });
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getBookById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ status: "error", message: "Invalid ID" });
    }
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ status: "error", message: "Not Found" });
        }
        res.status(200).json({ status: "success", data: { book } });
    } catch (error) {
        console.error('Error in getBookById:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

const updateBook = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
            }
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }
        console.log('Received updateBook payload:', req.body, 'File:', req.file); // Debug log
        let bookData = { ...req.body };
        if (req.file) {
            bookData.coverImage = req.file.filename;
        }
        // Convert authors and genres to arrays if strings
        if (bookData.authors && typeof bookData.authors === 'string') {
            bookData.authors = bookData.authors.split(',').map(v => v.trim()).filter(v => v);
        }
        if (bookData.genres && typeof bookData.genres === 'string') {
            bookData.genres = bookData.genres.split(',').map(v => v.trim()).filter(v => v);
        }
        // Validate fields
        if (bookData.authors && !bookData.authors.length) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
            }
            return res.status(400).json({ status: "fail", message: "Authors must be a non-empty array" });
        }
        if (bookData.genres && !bookData.genres.length) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
            }
            return res.status(400).json({ status: "fail", message: "Genres must be a non-empty array" });
        }
        if (bookData.publicationYear) {
            bookData.publicationYear = Number(bookData.publicationYear);
            if (isNaN(bookData.publicationYear)) {
                if (req.file) {
                    fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
                }
                return res.status(400).json({ status: "fail", message: "Invalid publicationYear" });
            }
        }
        if (bookData.pageCount) {
            bookData.pageCount = Number(bookData.pageCount);
            if (isNaN(bookData.pageCount)) {
                if (req.file) {
                    fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
                }
                return res.status(400).json({ status: "fail", message: "Invalid pageCount" });
            }
        }
        if (bookData.ratings !== undefined && bookData.ratings !== '') {
            bookData.ratings = Number(bookData.ratings);
            if (isNaN(bookData.ratings)) {
                if (req.file) {
                    fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
                }
                return res.status(400).json({ status: "fail", message: "Invalid ratings" });
            }
        }
        if (bookData.totalRatings !== undefined && bookData.totalRatings !== '') {
            bookData.totalRatings = Number(bookData.totalRatings);
            if (isNaN(bookData.totalRatings)) {
                if (req.file) {
                    fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
                }
                return res.status(400).json({ status: "fail", message: "Invalid totalRatings" });
            }
        }
        if (bookData.createdAt) {
            const date = new Date(bookData.createdAt);
            if (isNaN(date.getTime())) {
                if (req.file) {
                    fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
                }
                return res.status(400).json({ status: "fail", message: "Invalid createdAt date" });
            }
            bookData.createdAt = date;
        }
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, bookData, { new: true, runValidators: true });
        if (!updatedBook) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
            }
            return res.status(404).json({ status: "error", message: "Book not found" });
        }
        res.status(200).json({ status: "success", data: { book: updatedBook } });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, "..", "uploads", "books", req.file.filename));
        }
        console.error('Error in updateBook:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ status: "error", message: "Book not found" });
        }
        res.status(200).json({ status: "success", data: { book: deletedBook } });
    } catch (error) {
        console.error('Error in deleteBook:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

const searchBooksByAuthor = async (req, res) => {
  try {
    const author = req.query.author;
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    if (!author) {
      return res.status(400).json({ status: "fail", message: "Author parameter is required" });
    }
    const books = await Book.find({ authors: { $regex: author, $options: 'i' } })
      .skip(skip)
      .limit(limit);
    const totalBooks = await Book.countDocuments({ authors: { $regex: author, $options: 'i' } });
    res.status(200).json({
      status: "success",
      totalBooks,
      data: { books }
    });
  } catch (error) {
    console.error('Error in searchBooksByAuthor:', error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// books.controllers.js - add searchBooksByTitle
const searchBooksByTitle = async (req, res) => {
  try {
    const title = req.query.title;
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    
    if (!title) {
      return res.status(400).json({ status: "fail", message: "Title parameter is required" });
    }
    
    const books = await Book.find({ title: { $regex: title, $options: 'i' } })
      .skip(skip)
      .limit(limit);
      
    const totalBooks = await Book.countDocuments({ title: { $regex: title, $options: 'i' } });
    
    res.status(200).json({
      status: "success",
      totalBooks,
      data: { books }
    });
  } catch (error) {
    console.error('Error in searchBooksByTitle:', error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    searchBooksByAuthor, 
    searchBooksByTitle,
};
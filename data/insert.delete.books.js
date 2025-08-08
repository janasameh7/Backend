const connectDB = require("../config/db");
const booksData = require("./books.json"); 
const Book = require("../models/books.models"); 

const insertBooks = async () => {
    try {
        await connectDB();
        await Book.insertMany(booksData);
        console.log("Books inserted successfully");
    } catch (error) {
        console.log("Error in insert books", error.message);
    }
};

const deleteBooks = async () => {
    try {
        await connectDB();
        await Book.deleteMany(booksData); 
        console.log("Books deleted successfully");
    } catch (error) {
        console.log("Error in delete books", error.message);
        process.exit(1);
    }
};

if (process.argv[2] === "--insert") {
    insertBooks();
} else if (process.argv[2] === "--delete") {
    deleteBooks();
} else {
    console.log("Unknown command");
    process.exit();
};
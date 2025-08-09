const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book Title is required"],
        unique: true,
        trim: true,
    },
    language: {
    type: String,
    required: [true, "Language is required"],
    enum: ["English", "Arabic", "French", "Korean", "Spanish", "Chinese", "Japanese", "Hindi"] 
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    authors: {
        type: [String]
    },
    genre: { 
        type: [String],
        required: [true, "Genre is required"],
        enum: {
            values: [ "Mystery", "Fantasy", "Science Fiction", "Biography", "History"],
            message: "Genre must be one of: Mystery, Fantasy, Science Fiction, Biography, History"
        }
    },
    description: { type: String },
    pageCount: {
        type: Number,
        required: [true, "Page count is required"],
        max: [5000, "Max page count is 5000"]
    },
    ratings: { type: Number, default: 1.0 },
    totalRatings: {
        type: Number,
    },
    publicationYear: {
        type: Number,
        required: [true, "Publication year is required"]
    }
});
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
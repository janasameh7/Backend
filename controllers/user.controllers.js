const User = require("../models/user.models");
const Book = require("../models/book.models");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken"); 
const fs = require("fs");
const path = require("path");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 });
    res.status(200).json({
      status: "success",
      length: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

const signup = async (req, res) => {
    try {
        
        let { password, confirmPassword, photo, name, email } = req.body;
        console.log(req.body);
        
        // if (password !== confirmPassword) {
        //     if (req.file) {
        //         fs.unlinkSync(path.join(__dirname, "..", "uploads","users", req.file.filename));
        //     }
        //     return res.status(400).json({
        //         status: "fail",
        //         message: "Passwords do not match",
        //     });
        // }

        const existingUser = await User.findOne({ email});
        if (existingUser) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, "..", "uploads","users", req.file.filename));
            }
            return res.status(400).json({
                status: "fail",
                message: "User already exists",
            });
        }

        photo = req.file.filename;

        const user = await User.create({ name, email, password, photo });

       
        const token = JWT.sign(
            { id: user._id, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res
            .status(201)
            .json({ status: "success", token, data: { user } });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, "..", "uploads","users", req.file.filename));
        }
        res
            .status(400)
            .json({ status: "fail", message: `Error in Sign up ${error.message}` });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "fail", message: "Email or Password is missing" });
        }
        const existingUser = await User.findOne({ email }); 
        if (!existingUser) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        const matchedPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchedPassword) {
            return res.status(400).json({ status: "fail", message: "Password is wrong" });
        }
        const token = JWT.sign(
            { id: existingUser._id, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.status(200).json({
            status: "success", token: token, data: { user: existingUser.name} , message: "login"
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: `Error in login ${error.message}` }); 
    }
};

const addBookToFav = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.userId;
    if (!bookId || typeof bookId !=='string') {
      return res.status(400).json({ status: "fail", message: "Book Id Required" });
    }
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ status: "fail", message: "Book not found" });
    }
    const user = await User.findById(userId).populate('favBooks');
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }
    if (!user.favBooks.some(id => id.toString() === bookId)) {
      user.favBooks.push(bookId);
      await user.save();
    }
    res.status(200).json({ status: "success", data: { books: user.favBooks }, message: "Book Added" });
  } catch (error) {
    res.status(400).json({ status: "fail", message: `Error adding book to favorites: ${error.message}` });
  }
};

const removeBookFromFav = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.userId;
    if (!bookId || typeof bookId !=='string') {
      return res.status(400).json({ status: "fail", message: "Book Id Required" });
    }
    const user = await User.findById(userId).populate('favBooks');
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }
    user.favBooks = user.favBooks.filter(id => id.toString() !== bookId);
    await user.save();
    res.status(200).json({ status: "success", data: { books: user.favBooks }, message: "Book Removed" });
  } catch (error) {
    res.status(400).json({ status: "fail", message: `Error removing book from favorites: ${error.message}` });
  }
};

const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favBooks');
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }
    res.status(200).json({ status: "success", data: { books: user.favBooks } });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const isBookInFavorites = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }
    const isFavorite = user.favBooks.some(id => id.toString() === bookId);
    res.status(200).json({ status: "success", data: { isFavorite } });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const protectRoutes = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
        }
        if (!token) {
            return res.status(400).json({ status: "fail", message: "You are not logged in" });
        }
        const decodedToken = JWT.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.id;
        next();
    }
    catch (error) {
        res.status(401) 
            .json({ status: "fail", message: error.message });
    }
}

module.exports = { signup, getAllUsers, login, addBookToFav, removeBookFromFav, getUserFavorites, isBookInFavorites, protectRoutes };
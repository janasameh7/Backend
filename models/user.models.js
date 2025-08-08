const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email id required"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"], 
    },
    photo: { type: String, default: 'uploads/profile.jpg' },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Minimum length must be more than 8 characters"],
    },
    favBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }], 

});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
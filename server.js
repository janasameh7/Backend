const express = require("express");
const connectDB = require("./config/db");
const bookRouter = require("./routes/books.routes"); 
const userRouter = require("./routes/user.routes");
const path = require("path");

const PORT = process.env.PORT || 5000;

require("dotenv").config();

connectDB();
const app = express();

app.use(express.json());
app.use("/books", bookRouter); 
app.use("/users", userRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`);
});
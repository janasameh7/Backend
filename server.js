const express = require("express");
const connectDB = require("./config/db");
const bookRouter = require("./routes/books.routes"); 
const userRouter = require("./routes/user.routes");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 5000;


const app = express();

app.use(cors({origin:"http://localhost:4200"}));

require("dotenv").config();
app.use("/uploads/users", express.static(path.join(__dirname, "uploads","users")));
app.use("/uploads/books", express.static(path.join(__dirname, "uploads","books")));
connectDB();

app.use(express.json());
app.use("/books", bookRouter); 
app.use("/users", userRouter);


app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`);
});
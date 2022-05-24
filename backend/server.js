const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/db");
const { errorHandler, notFound } = require("./middlewares/errorHandler");

// connecting to database
dbConnect();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// user routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));

// not found handler
app.use(notFound);
// error handler
app.use(errorHandler);
// listen to port
const PORT = process.env.PORT || 5555;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));

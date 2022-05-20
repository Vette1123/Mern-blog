const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/db");

const app = express();
dbConnect();
const PORT = process.env.PORT || 5000;

app.listen(5555, console.log("Server is running on port 5555"));

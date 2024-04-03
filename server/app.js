const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const app = express();
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
require("dotenv").config();


/* 
  DATABASE Connection
*/


mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .catch(err => console.log(err));


/*
  Middlewares 
*/


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); 
app.use(helmet.crossOriginResourcePolicy({
  policy: "cross-origin" 
}));
app.use(cors());


/* 
  file server URL
*/


app.use("/api/files", express.static("files"));


/* 
  index router
*/


app.use("/api", indexRouter);


/* 
  Error handler
*/


// handling 404 error
app.use((req, res, next) => {
  const err = new createError.NotFound("Invalid URL");

  next(err);
})

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  
  res.status(err.status || 500).json(err.message); 
})


module.exports = app;
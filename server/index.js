// # PACKAGES
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const indexRouter = require("./routes/index");
require('dotenv').config();

// # DATABASE connection
async function main() {
  const mongoose = require("mongoose");
  await mongoose.connect(process.env.MONGODB_URI);
}
main().catch(err => console.log(err));

// # execute MIDDLEWARE(Codes for application)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// set static path in this app.
app.use('/static', express.static('public'));
app.use('/data', express.static('data'));
app.use('/', indexRouter);

// # ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json(err); 
})

// # SERVER RUNNING MESSAGE
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})

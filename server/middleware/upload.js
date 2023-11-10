const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const opts = {}


/* 
  middleware for file handling
*/


// storage option
opts.storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../files/${file.fieldname}/`);
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)

    cb(null, uniqueSuffix + extname);
  }
})


// filter option
opts.fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);
  let isError = false;

  switch (extname) {
    case ".jpg":
    case ".jpeg":
    case ".png":
      break;
    default:
      isError = true;
  }

  if (isError) {
    const err = new createError.BadRequest("Unacceptable type of file");
    return cb(err);
  }

  cb(null, true);
},


// limit option
opts.limits = { fileSize: 1e7 }


module.exports = multer(opts)

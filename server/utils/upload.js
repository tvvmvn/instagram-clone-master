const multer = require('multer');
const path = require('path');

const opts = {}

opts.storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../files/${file.fieldname}/`);
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)

    cb(null, uniqueSuffix + extname);
  }
})

opts.fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);

  let isError = false;

  switch (extname) {
    case '.jpg':
    case '.jpeg':
    case '.png':
      break;
    default:
      isError = true;
  }

  if (isError) {
    const err = new TypeError('Unacceptable type of file');
    err.status = 400;
    return cb(err);
  }

  cb(null, true);
},

opts.limits = { fileSize: 1e7 }

module.exports = multer(opts)

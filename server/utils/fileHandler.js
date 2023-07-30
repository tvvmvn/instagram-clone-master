const multer = require('multer');
const path = require('path');

module.exports = function fileHandler() {
  const multerOptions = {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `${__dirname}/../files/${file.fieldname}/`);
      },

      filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        
        cb(null, file.fieldname + '-' + uniqueSuffix + extname);
      }
    }),

    fileFilter: (req, file, cb) => {
      const extname = path.extname(file.originalname);

      const err = null;

      switch(extname) {
        case '.jpg':
        case '.jpeg':
        case '.png':
          break;
        default:
          err = new TypeError('This type of file is not acceptable.');
      }

      if (err) {
        return cb(err);
      }

      cb(null, true);
    },

    limits: {
      fileSize: 1e7,
      files: 10
    }
  }

  return multer(multerOptions);
}
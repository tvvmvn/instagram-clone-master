const multer = require('multer');
const path = require('path');

const multerOptions = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../files/photos/`);
    },
  
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      
      cb(null, 'photo-' + uniqueSuffix + extname);
    }
  }),

  fileFilter: (req, file, cb) => {
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
      const err = new Error('This type of file is not acceptable.');
      err.status = 400;
      return cb(err);
    }
  
    cb(null, true);
  },
  
  limits: { fileSize: 1e7, limits: 10 }
};

module.exports = [
  multer(multerOptions).array('photos'),
  async (req, res, next) => {
    const files = req.files;

    if (!files || files.length < 1) {
      const err = new Error('File is required');
      err.status = 400;
      return next(err);
    }

    next()
  }
]

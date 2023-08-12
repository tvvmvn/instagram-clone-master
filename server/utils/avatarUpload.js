const multer = require('multer');
const path = require('path');

const multerOptions = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../files/avatars/`);
    },
  
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      
      cb(null, 'avatar-' + uniqueSuffix + extname);
    }
  }),
  
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname);
  
    let isError = false;
  
    switch(extname) {
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
  
  limits: { fileSize: 1e7 }
};

module.exports = multer(multerOptions).single('avatar');

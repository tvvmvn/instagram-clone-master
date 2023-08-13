const User = require('../models/User');
const { body, validationResult } = require('express-validator');

module.exports = async (req, res, next) => {
  try {
    const emailInUse = async (email) => {
      const user = await User.findOne({ email });
      
      if (user) {
        return Promise.reject('E-mail is already in use');
      }
    }
    
    const usernameInUse = async (username) => {
      const user = await User.findOne({ username });
    
      if (user) {
        return Promise.reject('Username is already in use');
      }
    }
  
    const validations = [
      body('email').isEmail()
        .custom(emailInUse),
      body('username').trim().isLength({ min: 5 }).isAlphanumeric()
        .custom(usernameInUse),
      body('password').trim().isLength({ min: 5 }),
    ]
  
    for (let validation of validations) {
      const result = await validation.run(req);
  
      if (result.errors.length) break;
    }
  
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const err = new Error();
      err.errors = errors.array();
      err.status = 400;
      throw err;
    }
    
    next();
  
  } catch (error) {
    next(error)
  }
};
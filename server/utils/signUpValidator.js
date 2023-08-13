const User = require('../models/User');
const { body } = require('express-validator');

module.exports = async (req, res, next) => {
  try {
    const emailResult = await body('email')
      .isEmail()
      .custom(async (email) => {
        const user = await User.findOne({ email });
        
        if (user) {
          throw new Error('E-mail is already in use');
        }
      })
      .run(req)

    if (!emailResult.isEmpty()) {
      const err = new Error('E-mail validation failed');
      err.status = 400;
      throw err;
    }

    const usernameResult = await body('username')
      .trim()
      .isLength({ min: 5 })
      .isAlphanumeric()
      .custom(async (username) => {
        const user = await User.findOne({ username });
      
        if (user) {
          throw new Error('Username is already in use');
        }
      })
      .run(req)

    if (!usernameResult.isEmpty()) {
      const err = new Error('Username validation failed');
      err.status = 400;
      throw err;
    }

    const passwordError = await body('password')
      .trim()
      .isLength({ min: 5 })
      .run(req)

    if (!passwordError.isEmpty()) {
      const err = new Error('Password validation failed');
      err.status = 400;
      throw err;
    }
    
    next();
  
  } catch (error) {
    next(error)
  }
};
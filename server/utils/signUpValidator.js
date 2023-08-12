const User = require('../models/User');
const { body, validationResult } = require('express-validator');

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

module.exports = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('E-mail is not valid')
    .custom(emailInUse),
  body('username')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Username must be at least 5 characters')
    .isAlphanumeric()
    .withMessage("Username is only allowed in alphabet and number.")
    .custom(usernameInUse),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error();
      err.errors = errors.array();
      err.status = 400;
      return next(err);
    }

    next()
  }
]
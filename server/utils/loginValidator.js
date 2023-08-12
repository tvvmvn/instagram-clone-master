const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const doesEmailExists = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return Promise.reject('E-mail does not exists');
  }
}

const doesPasswordMatch = async (password, { req }) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  
  if (!user.checkPassword(password)) {
    return Promise.reject('Password does not match');
  }
}

module.exports = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-mail is required')
    .custom(doesEmailExists),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .custom(doesPasswordMatch),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error();
      err.errors = errors.array();
      err.status = 401;
      return next(err);
    }

    next()
  }
]
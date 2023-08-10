const User = require('../models/User');
const { body } = require('express-validator');

exports.isValidEmail = () => body('email')
  .trim()
  .isEmail()
  .withMessage('E-mail is not valid')

exports.isValidUsername = () => body('username')
  .trim()
  .isLength({ min: 5 })
  .withMessage('Username must be at least 5 characters')
  .isAlphanumeric()
  .withMessage("Username is only allowed in alphabet and number.")

exports.isValidPassword = () => body('password')
  .trim()
  .isLength({ min: 5 })
  .withMessage('Password must be at least 5 characters')

exports.emailInUse = async (email) => {
  const user = await User.findOne({ email });
  
  if (user) {
    return Promise.reject('E-mail is already in use');
  }
}

exports.usernameInUse = async (username) => {
  const user = await User.findOne({ username });

  if (user) {
    return Promise.reject('Username is already in use');
  }
}

exports.doesEmailExists = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return Promise.reject('E-mail does not exists');
  }
}

exports.doesPasswordMatch = async (password, { req }) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  
  if (!user.checkPassword(password)) {
    return Promise.reject('Password does not match');
  }
}
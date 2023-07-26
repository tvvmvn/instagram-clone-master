const User = require('../models/User');
const fileHandler = require('../utils/fileHandler');
const { body, validationResult } = require('express-validator');

// Middleware
const isValidUsername = () => body('username')
  .trim()
  .isLength({ min: 5 }).withMessage('Username must be at least 5 characters')
  .isAlphanumeric().withMessage("Username is only allowed in alphabet and number.")

const isValidEmail = () => body('email')
  .trim()
  .isEmail().withMessage('E-mail is not valid')

const isValidPassword = () => body('password')
  .trim()
  .isLength({ min: 5 }).withMessage('Password must be at least 5 characters')

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

const doesEmailExists = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return Promise.reject('User is not found');
  }
}

const doesPasswordMatch = async (password, { req }) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  
  if (!user.checkPassword(password)) {
    return Promise.reject('Password does not match');
  }
}

exports.create = [
  isValidUsername().custom(usernameInUse),
  isValidEmail().custom(emailInUse),
  isValidPassword(),
  async (req, res, next) => {
    try {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const err = new Error();
        err.errors = errors.array();
        err.status = 400;
        throw err;
      }

      const { email, fullName, username, password } = req.body;

      const user = new User();

      user.email = email;
      user.fullName = fullName;
      user.username = username;
      user.setPassword(password);

      await user.save();

      res.json({ user });

    } catch (error) {
      next(error)
    }
  }
]

exports.login = [
  isValidEmail().custom(doesEmailExists),
  isValidPassword().custom(doesPasswordMatch),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const err = new Error();
        err.errors = errors.array();
        err.status = 401;
        throw err;
      }

      const { email } = req.body;

      const _user = await User.findOne({ email });

      const access_token = _user.generateJWT();
  
      const user = {
        username: _user.username,
        fullName: _user.fullName,
        avatar: _user.avatar,
        bio: _user.bio,
        access_token
      }
  
      res.json({ user })
  
    } catch (error) {
      next(error)
    }
  }
]

exports.update = [
  fileHandler('profiles').single('avatar'),
  isValidUsername().custom(usernameInUse).optional(),
  isValidEmail().custom(emailInUse).optional(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const err = new Error();
        err.errors = errors.array();
        err.status = 400;
        throw err;
      }

      const _user = req.user;

      if (req.file) {
        _user.avatar = req.file.filename;
      }

      Object.assign(_user, req.body);

      await _user.save();

      const access_token = _user.generateJWT();

      const user = {
        username: _user.username,
        fullName: _user.fullName,
        avatar: _user.avatar,
        bio: _user.bio,
        access_token
      }

      res.json({ user })

    } catch (error) {
      next(error)
    }
  }
]

exports.findOne = async (req, res, next) => {};
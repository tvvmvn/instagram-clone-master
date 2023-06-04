const User = require('../models/User');
const fileHandler = require('../utils/fileHandler');
const { check, validationResult } = require('express-validator');

exports.create = [
  check('username')
    .isLength({ min: 5 }).withMessage('Username must be at least 5 chars long')
    .custom(async (username) => {
      const user = await User.findOne({ username });

      if (user) {
        return Promise.reject('Username already in use');
      }
    }),
  check('email')
    .isEmail().withMessage('E-mail is not valid')
    .custom(async (email) => {
      const user = await User.findOne({ email });

      if (user) {
        return Promise.reject('E-mail already in use');
      }
    }),
  check('password')
    .isLength({ min: 5 }).withMessage('Password is not safe'),
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

exports.update = [
  fileHandler('profiles').single('avatar'),
  check('username')
    .optional()
    .isLength({ min: 5 }).withMessage('Username must be at least 5 chars long')
    .custom(async (username) => {
      const user = await User.findOne({ username });

      if (user) {
        return Promise.reject('Username already in use');
      }
    }),
  check('email')
    .optional()
    .isEmail().withMessage('E-mail is not valid')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      
      if (user) {
        return Promise.reject('E-mail already in use');
      }
    }),
  async (req, res, next) => {
    try {
      const _user = req.user;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const err = new Error();
        err.errors = errors.array();
        err.status = 400;
        throw err;
      }

      if (req.file) {
        _user.avatar = req.file.filename;
      }

      Object.assign(_user, req.body);

      await _user.save();

      const token = _user.generateJWT();

      const user = {
        username: _user.username,
        email: _user.email,
        fullName: _user.fullName,
        avatar: _user.avatar,
        bio: _user.bio,
        token
      }

      res.json({ user })

    } catch (error) {
      next(error)
    }
  }
]

exports.login = [
  check('email')
    .isEmail().withMessage('E-mail is not valid')
    .custom(async (email) => {
      const user = await User.findOne({ email });

      if (!user) {
        return Promise.reject('User not found');
      }
    }),
  check('password')
    .isLength({ min: 5 }).withMessage('Password is not valid')
    .custom(async (password, { req }) => {
      const email = req.body.email;
      const user = await User.findOne({ email });
      
      if (!user.checkPassword(password)) {
        return Promise.reject('Password not match');
      }
    }),
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

      const token = _user.generateJWT();
  
      const user = {
        username: _user.username,
        email: _user.email,
        fullName: _user.fullName,
        avatar: _user.avatar,
        bio: _user.bio,
        token
      }
  
      res.json({ user })
  
    } catch (error) {
      next(error)
    }
  }
]
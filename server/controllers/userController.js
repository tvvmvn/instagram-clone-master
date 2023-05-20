const User = require('../models/User');
const fileHandler = require('../utils/fileHandler');
const { check, validationResult } = require('express-validator');

exports.create = [
  check('username')
    .isLength({ min: 5 }).withMessage('username must be at least 5 chars long')
    .custom(async (value) => {
      const user = await User.findOne({ username: value });

      if (user) {
        return Promise.reject('Username already in use');
      }
    }),
  check('email')
    .isEmail().withMessage('E-mail is not valid')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });

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
  async (req, res, next) => {
    try {
      const _user = req.user;

      if (req.file) {
        _user.avatar = req.file.filename;
      }

      Object.assign(_user, req.body);
      // for (key in req.body) {
      //   _user[key] = req.body[key]
      // }

      await _user.save();

      const token = _user.generateJWT();

      const user = {
        email: _user.email,
        username: _user.username,
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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const _user = await User.findOne({ email });

    if (!_user) {
      const err = new Error('User not found');
      err.status = 401;
      throw err;
    }

    if (!_user.checkPassword(password)) {
      const err = new Error('Password not match');
      err.status = 401;
      throw err;
    }

    const token = _user.generateJWT();

    const user = {
      email: _user.email,
      username: _user.username,
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
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { 
  isValidEmail,
  isValidUsername,
  isValidPassword,
  emailInUse,
  usernameInUse,
  doesEmailExists,
  doesPasswordMatch
} = require('../utils/validator');

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

      const { email, name, username, password } = req.body;

      const user = new User();

      user.email = email;
      user.name = name;
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
        name: _user.name,
        avatarUrl: _user.avatarUrl,
        bio: _user.bio,
        access_token
      }
  
      res.json({ user })
  
    } catch (error) {
      next(error)
    }
  }
]
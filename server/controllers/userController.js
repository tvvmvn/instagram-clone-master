const User = require('../models/User');
const Follow = require('../models/Follow');
const Favorite = require('../models/Favorite');
const fileHandler = require('../utils/fileHandler');
const { check, validationResult } = require('express-validator');

exports.users = async (req, res, next) => {
  try {

    const where = {};

    if ('following' in req.query) {
      const user = await User.findOne({ username: req.query.following });
      const follows = await Follow
        .find({ follower: user._id })

      where._id = follows.map(follow => follow.following);
    }

    if ('followers' in req.query) {
      const user = await User.findOne({ username: req.query.followers });
      const follows = await Follow
        .find({ following: user._id })

      where._id = follows.map(follow => follow.follower);
    }

    if ('favorite' in req.query) {
      const favorites = await Favorite.find({ article: req.query.favorite })

      where._id = favorites.map(favorite => favorite.user);
    }

    if ('username' in req.query) {
      where.username = new RegExp(req.query.username, 'i');
    }

    const userCount = await User.count(where);

    const _users = await User.
      find(where)
      .limit(10)
      .skip(0)

    const users = [];

    for (const _user of _users) {
      const follow = await Follow
        .findOne({ follower: req.user._id, following: _user._id });

      const user = {
        username: _user.username,
        image: _user.image,
        isFollowing: !!follow
      }

      users.push(user);
    }

    res.json({ users, userCount });

  } catch (error) {
    next(error)
  }
} 

exports.register = [
  check('username').isLength({ min: 5 }),
  check('email').isEmail(),
  check('password').isLength({ min: 5 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const err = new Error('Validataion failed');
        err.status = 400;
        throw err;
      }

      const { email, fullName, username, password } = req.body;

      const userByUsername = await User.findOne({ username });
      
      if (userByUsername) {
        const err = new Error('Username already in use');
        err.status = 400;
        throw err;
      }

      const userByEmail = await User.findOne({ email });
      
      if (userByEmail) {
        const err = new Error('E-mail already in use');
        err.status = 400;
        throw err;
      }
  
      const user = new User();
      user.email = email;
      user.fullName = fullName;
      user.username = username;
      user.setPassword(password);
      user.image = 'default.png';
  
      await user.save();
  
      res.json({ user });
  
    } catch (error) {
      next(error)
    }
  }
]

exports.user = async (req, res, next) => {
  try {

    const user = await User.findOne({ email: req.params.email });

    res.json({ user })

  } catch (error) {
    next(error)
  }
}

exports.account = async (req, res, next) => {
  try {

    const account = {
      email: req.user.email,
      username: req.user.username,
      fullName: req.user.fullName,
      image: req.user.image,
      bio: req.user.bio
    }

    res.json({ account });

  } catch (error) {
    next(error)
  }
}

exports.accountEdit = [
  fileHandler('profiles').single('image'),
  async (req, res, next) => {
    try {

      const _user = await User.findById(req.user._id);

      if (req.file) {
        _user.image = req.file.filename;  
      }

      Object.assign(_user, req.body);
  
      await _user.save();
  
      const account = {
        email: _user.email,
        username: _user.username,
        fullName: _user.fullName,
        image: _user.image,
        bio: _user.bio
      }
  
      res.json({ account })

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
      username: _user.username,
      image: _user.image,
      token
    }

    res.json({ user })

  } catch (error) {
    next(error)
  }
}
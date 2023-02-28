const User = require('../models/User');
const Follow = require('../models/Follow');
const Favorite = require('../models/Favorite');
const fileHandler = require('../utils/fileHandler');
const { check, validationResult } = require('express-validator');

exports.users = async (req, res, next) => {
  try {

    const where = {};
    const limit = req.query.limit || 10;
    const skip = req.query.skip || 0;

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

    if ('email' in req.query) {
      where.email = req.query.email;
    }

    const userCount = await User.count(where);
    const _users = await User.
      find(where)
      .limit(limit)
      .skip(skip)

    const users = [];

    for (const _user of _users) {
      
      const user = {}
      user.username = _user.username;
      user.fullName = _user.fullName;
      user.image = _user.image;

      // if (req.user) {
      //   const follow = await Follow.
      //     findOne({ follower: req.user._id, following: _user._id });
        
      //   user.isFollowing = !!follow;
      // }

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
        const err = new Error();
        err.errors = errors.array();
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

exports.edit = [
  fileHandler('profiles').single('image'),
  async (req, res, next) => {
    try {

      const _user = req.user;

      if (req.file) {
        _user.image = req.file.filename;  
      }
      
      Object.assign(_user, req.body);
  
      await _user.save();

      const token = _user.generateJWT();
  
      const user = {
        email: _user.email,
        username: _user.username,
        fullName: _user.fullName,
        image: _user.image,
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
      image: _user.image,
      bio: _user.bio,
      token
    }

    res.json({ user })

  } catch (error) {
    next(error)
  }
}
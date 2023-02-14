const User = require('../models/User');
const Follow = require('../models/Follow');
const Favorite = require('../models/Favorite');
const fileHandler = require('../utils/fileHandler');

exports.user = async (req, res, next) => {
  try {

    const user = {
      email: req.user.email,
      username: req.user.username,
      fullName: req.user.fullName,
      image: req.user.image,
      bio: req.user.bio
    }

    res.json({ user });

  } catch (error) {
    next(error)
  }
}

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

exports.register = async (req, res, next) => {
  try {
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
      bio: _user.bio
    }

    res.json({ user, token })

  } catch (error) {
    next(error)
  }
}

exports.edit = [
  fileHandler('profiles').single('image'),
  async (req, res, next) => {
    try {
      const file = req.file;
      const _user = await User.findById(req.user._id);

      if (file) {
        _user.image = file.filename;
      }

      Object.assign(_user, req.body);
  
      await _user.save();
  
      const user = {
        email: _user.email,
        username: _user.username,
        fullName: _user.fullName,
        image: _user.image,
        bio: _user.bio
      }

      console.log(user)
  
      res.json({ user })

    } catch (error) {
      next(error)
    }
  }
]

exports.validate = async (req, res, next) => {
  try {
    if ('username' in req.query) {

      const username = req.query.username;
      const user = await User.findOne({ username });
  
      res.json({ user })
    }
    

  } catch (error) {
    next(error)
  }
}
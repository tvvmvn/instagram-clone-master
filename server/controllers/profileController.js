const User = require('../models/User');
const Follow = require('../models/Follow');
const fileHandler = require('../utils/fileHandler');

exports.update = [
  fileHandler().single('avatar'),
  async (req, res, next) => {
    try {
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

exports.find = async (req, res, next) => {
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

    if ('username' in req.query) {
      where.username = new RegExp(req.query.username, 'i');
    }

    const profileCount = await User.count(where);

    const profiles = await User
      .find(where, 'username fullName avatar bio')
      .populate({ 
        path: 'isFollowing',
        match: { follower: req.user._id }
      })
      .limit(limit)
      .skip(skip)

    res.json({ profiles, profileCount });

  } catch (error) {
    next(error)
  }
} 

exports.findOne = async (req, res, next) => {
  try {
    const profile = await User
      .findOne({ username: req.params.username }, 'username fullName avatar bio')
      .populate('articleCount')
      .populate('followerCount')
      .populate('followingCount')
      .populate({
        path: 'isFollowing',
        match: { follower: req.user._id }
      })

    if (!profile) {
      const err = new Error("Profile is not found");
      err.status = 404;
      throw err;
    }

    res.json({ profile });

  } catch (error) {
    next(error)
  }
}

exports.follow = async (req, res, next) => {
  try {
    const profile = await User.findOne({ username: req.params.username })
      .populate({
        path: 'isFollowing',
        match: { follower: req.user._id }
      })

    if (!profile) {
      const err = new Error('Profile is not found')
      err.status = 404;
      throw err;
    }

    if (req.user.username === req.params.username) {
      const err = new Error('Cannot Follow yourself')
      err.status = 400;
      throw err;
    }

    if (!profile.isFollowing) {
      const follow = new Follow({
        follower: req.user._id,
        following: profile._id
      })
  
      await follow.save();
    }

    res.json({ profile });

  } catch (error) {
    next(error)
  }
}

exports.unfollow = async (req, res, next) => {
  try {
    const profile = await User.findOne({ username: req.params.username })
      .populate({
        path: 'isFollowing',
        match: { follower: req.user._id }
      })

    if (!profile) {
      const err = new Error('Profile is not found')
      err.status = 404;
      throw err;
    }

    if (profile.isFollowing) {
      const follow = await Follow.findOne({ 
        follower: req.user._id, 
        following: profile._id 
      });
  
      await follow.delete();
    }

    res.json({ profile });

  } catch (error) {
    next(error)
  }
}

const User = require('../models/User');
const Follow = require('../models/Follow');
const Article = require('../models/Article');

exports.update = [
  fileHandler('profiles').single('avatar'),
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

      const user = {
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

    if ('favorite' in req.query) {
      const favorites = await Favorite.find({ article: req.query.favorite })

      where._id = favorites.map(favorite => favorite.user);
    }

    if ('username' in req.query) {
      where.username = new RegExp(req.query.username, 'i');
    }

    const profileCount = await User.count(where);

    const profiles = await User
      .find(where, 'username fullName avatar')
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

    const _profile = await User
      .findOne({ username: req.params.username }, 'username fullName avatar bio')
      .populate({
        path: 'isFollowing',
        match: { follower: req.user._id }
      })

    if (!_profile) {
      const err = new Error("Profile not found");
      err.status = 404;
      throw err;
    }
    
    const { 
      username, 
      fullName, 
      avatar, 
      bio, 
      isFollowing 
    } = _profile;

    const followingCount = await Follow.count({ follower: _profile._id })
    const followerCount = await Follow.count({ following: _profile._id })
    const articleCount = await Article.count({ author: _profile._id })

    const profile = {
      username, 
      fullName, 
      avatar, 
      bio, 
      isFollowing,
      followingCount,
      followerCount,
      articleCount
    }

    res.json({ profile });

  } catch (error) {
    next(error)
  }
}

exports.follow = async (req, res, next) => {
  try {

    if (req.user.username === req.params.username) {
      const err = new Error('Cannot Follow yourself')
      err.status = 400;
      throw err;
    }

    const profile = await User
      .findOne({ username: req.params.username }, 'username fullName avatar bio');

    if (!profile) {
      const err = new Error('Profile not found')
      err.status = 404;
      throw err;
    }

    const _follow = await Follow
      .findOne({ follower: req.user._id, following: profile._id })

    if (!_follow) {
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

    const username = req.params.username;
    const profile = await User.findOne({ username }, 'username fullName avatar bio');

    if (!profile) {
      const err = new Error('Profile not found')
      err.status = 404;
      throw err;
    }

    const follow = await Follow
      .findOne({ follower: req.user._id, following: profile._id });

    if (follow) {
      await follow.delete();
    }

    res.json({ profile });

  } catch (error) {
    next(error)
  }
}

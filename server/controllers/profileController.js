const User = require('../models/User');
const Following = require('../models/Following');

exports.update = async (req, res, next) => {
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

exports.find = async (req, res, next) => {
  try {
    const where = {};
    const limit = req.query.limit || 10;
    const skip = req.query.skip || 0;

    if ('following' in req.query) {
      const user = await User
        .findOne({ username: req.query.following });

      const followingUsers = await Following
        .find({ user: user._id })

      const followingIds = followingUsers
        .map(followingUser => followingUser.following);

      where._id = followingIds;
    }

    if ('followers' in req.query) {
      const user = await User
        .findOne({ username: req.query.followers });

      const followers = await Following
        .find({ following: user._id })

      const followerIds = followers.map(follower => follower.user);

      where._id = followerIds;
    }

    if ('username' in req.query) {
      const patt = new RegExp(req.query.username, 'i');
      
      where.username = patt;
    }
    
    const profileFields = 'username name avatar avatarUrl bio';
    
    const profiles = await User
      .find(where, profileFields)
      .populate({ 
        path: 'isFollowing',
        match: { user: req.user._id }
      })
      .limit(limit)
      .skip(skip)
    
    const profileCount = await User.count(where);
    
    res.json({ profiles, profileCount });

  } catch (error) {
    next(error)
  }
} 

exports.findOne = async (req, res, next) => {
  try {
    const profileFields = 'username name avatar avatarUrl bio';

    const profile = await User
      .findOne({ username: req.params.username }, profileFields)
      .populate('postCount')
      .populate('followerCount')
      .populate('followingCount')
      .populate({
        path: 'isFollowing',
        match: { user: req.user._id }
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
    const profile = await User
      .findOne({ username: req.params.username })
      .populate({
        path: 'isFollowing',
        match: { user: req.user._id }
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
      const following = new Following({
        user: req.user._id,
        following: profile._id
      })
  
      await following.save();
    }

    res.json({ profile });

  } catch (error) {
    next(error)
  }
}

exports.unfollow = async (req, res, next) => {
  try {
    const profile = await User
      .findOne({ username: req.params.username })
      .populate({
        path: 'isFollowing',
        match: { user: req.user._id }
      })

    if (!profile) {
      const err = new Error('Profile is not found')
      err.status = 404;
      throw err;
    }

    if (profile.isFollowing) {
      const following = await Following
        .findOne({ 
          user: req.user._id, 
          following: profile._id 
        });
  
      await following.deleteOne();
    }

    res.json({ profile });

  } catch (error) {
    next(error)
  }
}

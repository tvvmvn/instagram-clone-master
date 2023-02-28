const User = require('../models/User');
const Follow = require('../models/Follow');
const Article = require('../models/Article');

exports.details = async (req, res, next) => {
  try {

    const user = await User
      .findOne({ username: req.params.username });

    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const follow = await Follow
      .findOne({ follower: req.user._id, following: user._id })
    const followingCount = await Follow.count({ follower: user._id })
    const followerCount = await Follow.count({ following: user._id })
    const articleCount = await Article.count({ author: user._id })

    const profile = {
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      image: user.image,
      isFollowing: !!follow,
      followerCount,
      followingCount,
      articleCount
    }

    res.json({ profile });

  } catch (error) {
    next(error)
  }
}

exports.follow = async (req, res, next) => {
  try {

    const user = await User.findOne({ username: req.params.username })

    const _follow = await Follow
      .findOne({ follower: req.user._id, following: user._id })

    if (_follow) {
      const err = new Error("You are following this user already.");
      err.status = 400;
      throw err;
    }

    const follow = new Follow({
      follower: req.user._id,
      following: user._id
    })

    await follow.save();

    res.json({ follow });

  } catch (error) {
    next(error)
  }
}

exports.unfollow = async (req, res, next) => {
  try {

    const username = req.params.username;
    const user = await User.findOne({ username });

    const follow = await Follow
      .findOne({ follower: req.user._id, following: user._id });

    if (!follow) {
      const err = new Error("You are not following this user.");
      err.status = 400;
      throw err;
    }

    await follow.delete();

    res.json({ follow });

  } catch (error) {
    next(error)
  }
}

const User = require("../models/User");
const Following = require("../models/Following");
const createError = require("http-errors");


/*
  Profile controller

  1 find
  2 findOne
  3 follow
  4 unfollow
*/


exports.find = async (req, res, next) => {
  try {
    const where = {};

    if ("following" in req.query) {
      const user = await User
        .findOne({ username: req.query.following });

      if (!user) {
        throw new createError.NotFound("Profile is not found")
      }

      const followingUsers = await Following
        .find({ user: user._id })

      const followingIds = followingUsers
        .map(followingUser => followingUser.following);

      where._id = followingIds;
    }

    if ("followers" in req.query) {
      const user = await User
        .findOne({ username: req.query.followers });

      if (!user) {
        throw new createError.NotFound("Profile is not found");
      }

      const followers = await Following
        .find({ following: user._id })

      const followerIds = followers.map(follower => follower.user);

      where._id = followerIds;
    }

    if ("username" in req.query) {
      const patt = new RegExp(req.query.username, "i");
      
      where.username = patt;
    }
    
    const profileFields = "username name avatar avatarUrl bio";
    
    const profiles = await User
      .find(where, profileFields)
      .populate({ 
        path: "isFollowing",
        match: { user: req.user._id }
      })
    
    const profileCount = await User.countDocuments(where);
    
    res.json({ profiles, profileCount });

  } catch (error) {
    next(error)
  }
} 


exports.findOne = async (req, res, next) => {
  try {
    const profileFields = "username name avatar avatarUrl bio";

    const profile = await User
      .findOne({ username: req.params.username }, profileFields)
      .populate("postCount")
      .populate("followerCount")
      .populate("followingCount")
      .populate({
        path: "isFollowing",
        match: { user: req.user._id }
      })

    if (!profile) {
      throw new createError.NotFound("Profile is not found");
    }

    res.json({ profile });

  } catch (error) {
    next(error)
  }
}


exports.follow = async (req, res, next) => {
  try {
    const profileFields = "username name avatar avatarUrl bio";
    const profile = await User
      .findOne({ username: req.params.username }, profileFields)

    if (!profile) {
      throw new createError.NotFound("Profile is not found");
    }

    if (req.user.username === req.params.username) {
      throw new createError.BadRequest("Cannot follow yourself");
    }

    const isFollowing = await Following
      .findOne({ user: req.user._id, following: profile._id });

    if (!isFollowing) {
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
    const profileFields = "username name avatar avatarUrl bio";
    const profile = await User
      .findOne({ username: req.params.username }, profileFields)

    if (!profile) {
      throw new createError.NotFound("Profile is not found");
    }

    const isFollowing = await Following
      .findOne({ user: req.user._id, following: profile._id });

    if (isFollowing) {  
      await isFollowing.deleteOne();
    }

    res.json({ profile });

  } catch (error) {
    next(error)
  }
}

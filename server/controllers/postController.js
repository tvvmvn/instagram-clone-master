const User = require("../models/User");
const Following = require("../models/Following");
const Post = require("../models/Post");
const Likes = require("../models/Likes");
const createError = require("http-errors");


/* 
  Post controller

  1 feed

  2 find
  Find posts

  3 findOne
  Find a post

  4 create
  Create a post

  5 deleteOne
  Delete a post

  6 like
  Like a post

  7 unlike
  Unlike a post
*/


exports.feed = async (req, res, next) => {
  try {
    const followingDocs = await Following.find({ user: req.user._id });

    const followings = followingDocs
      .map(followingDoc => followingDoc.following);
    
    const where = { user: [...followings, req.user._id] };
    const limit = req.query.limit || 5;
    const skip = req.query.skip || 0;

    const posts = await Post.find(where)
      .populate({
        path: "user",
        select: "username avatar avatarUrl"
      })
      .populate("commentCount")
      .populate({
        path: "liked",
        match: { user: req.user._id }
      })
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(limit)
    
    const postCount = await Post.countDocuments(where);

    res.json({ posts, postCount });

  } catch (error) {
    next(error)
  }
}


exports.find = async (req, res, next) => {
  try {
    const where = {}

    // timeline
    if ("username" in req.query) {
      const user = await User.findOne({ username: req.query.username });

      if (!user) { 
        throw new createError.NotFound("User is not found");
      }
      
      where.user = user._id;
    }
    
    const posts = await Post
      .find(where)
      .populate("commentCount")
      .sort({ createdAt: "desc" })

    const postCount = await Post.countDocuments(where);
    
    res.json({ posts, postCount });

  } catch (error) {
    next(error)
  }
}


exports.findOne = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: "user",
        select: "username avatar avatarUrl"
      })
      .populate("commentCount")
      .populate({
        path: "liked",
        match: { user: req.user._id }
      })

    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    res.json({ post });

  } catch (error) {
    next(error)
  }
}


exports.create = async (req, res, next) => {
  try {    
    const files = req.files;

    if (!files || files.length < 1) {
      throw new createError.BadRequest("File is required");
    }

    const photoNames = files.map(file => file.filename);

    const post = new Post({
      photos: photoNames,
      caption: req.body.caption,
      user: req.user._id
    });

    await post.save();

    res.json({ post });

  } catch (error) {
    next(error)
  }
}


exports.deleteOne = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    const isMaster = req.user._id.toString() === post.user.toString();

    if (!isMaster) {
      throw new createError.BadRequest("Incorrect User");
    }

    await post.deleteOne();

    res.json({ post });

  } catch (error) {
    next(error)
  }
}


exports.like = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    const liked = await Likes
      .findOne({ user: req.user._id, post: post._id });

    if (!liked) {
      const likes = new Likes({
        user: req.user._id,
        post: post._id
      })
      
      await likes.save();

      post.likesCount++;
      await post.save();
    }

    res.json({ post })

  } catch (error) {
    next(error)
  }
}


exports.unlike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    const liked = await Likes
      .findOne({ user: req.user._id, post: post._id });

    if (liked) {
      await liked.deleteOne();
  
      post.likesCount--;
      await post.save();
    }

    res.json({ post });

  } catch (error) {
    next(error)
  }
}
const User = require('../models/User');
const Following = require('../models/Following');
const Post = require('../models/Post');
const Likes = require('../models/Likes');
const fileHandler = require('../utils/fileHandler');

exports.feed = async (req, res, next) => {
  try {
    const followingUsers = await Following.find({ user: req.user._id });
    const followingIds = followingUsers
      .map(followingUser => followingUser.following);
    const userId = req.user._id;
    
    const where = { user: [...followingIds, userId] }
    const limit = req.query.limit || 5;
    const skip = req.query.skip || 0;

    const postCount = await Post.count(where);
    
    const posts = await Post
      .find(where)
      .populate({
        path: 'user',
        select: 'username avatar avatarUrl'
      })
      .populate('commentCount')
      .populate({
        path: 'liked',
        match: { user: req.user._id }
      })
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit)

    console.log(posts)

    res.json({ posts, postCount });

  } catch (error) {
    next(error)
  }
}

exports.find = async (req, res, next) => {
  try {
    const where = {}
    const limit = req.query.limit || 9
    const skip = req.query.skip || 0

    if ('username' in req.query) {
      const user = await User.findOne({ username: req.query.username });
      
      where.user = user._id;
    }

    const postCount = await Post.count(where);

    const posts = await Post
      .find(where)
      .populate('commentCount')
      .sort({ createdAt: 'desc' })
      .limit(limit)
      .skip(skip)

    res.json({ posts, postCount });

  } catch (error) {
    next(error)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const post = await Post
      .findById(req.params.id)
      .populate({
        path: 'user',
        select: 'username avatar avatarUrl'
      })
      .populate('commentCount')
      .populate({
        path: 'liked',
        match: { user: req.user._id }
      })

    if (!post) {
      const err = new Error("Post is not found");
      err.status = 404;
      throw err;
    }

    res.json({ post });

  } catch (error) {
    next(error)
  }
}

exports.create = [
  fileHandler().array('photos'),
  async (req, res, next) => {
    try {
      const files = req.files;

      if (files.length < 1) {
        const err = new Error('File is required');
        err.status = 400;
        throw err;
      }

      const photos = files.map(file => file.filename);

      const post = new Post({
        photos,
        caption: req.body.caption,
        user: req.user._id
      });

      await post.save();

      res.json({ post });

    } catch (error) {
      next(error)
    }
  }
]

exports.delete = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const err = new Error("Post is not found")
      err.status = 404;
      throw err;
    }

    const userId = req.user._id;
    const isMaster = userId.toString() === post.user.toString();

    if (!isMaster) {
      const err = new Error("Incorrect user")
      err.staus = 400;
      throw err;
    }

    await post.delete();

    res.json({ post });

  } catch (error) {
    next(error)
  }
}

exports.like = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'liked',
        match: { user: req.user._id }
      })

    if (!post) {
      const err = new Error("Post is not found");
      err.status = 404;
      throw err;
    }

    if (!post.liked) {
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
      .populate({
        path: 'liked',
        match: { user: req.user._id }
      })

    if (!post) {
      const err = new Error("Post is not found");
      err.status = 404;
      throw err;
    }

    if (post.liked) {
      const likes = await Likes.findOne({ 
        user: req.user._id, 
        post: post._id 
      });

      await likes.delete();
  
      post.likesCount--;

      await post.save();
    }

    res.json({ post });

  } catch (error) {
    next(error)
  }
}
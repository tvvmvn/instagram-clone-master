const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.find = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    const where = { post: post._id };
    const limit = req.query.limit || 10;
    const skip = req.query.skip || 0;

    const comments = await Comment
      .find(where)
      .populate({
        path: 'user',
        select: 'username avatar avatarUrl'
      })
      .sort({ createdAt: 'desc' })
      .limit(limit)
      .skip(skip)

    const commentCount = await Comment.count(where);

    res.json({ comments, commentCount });

  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const err = new Error("Post is not found")
      err.status = 404;
      throw err;
    }

    const comment = new Comment({
      content: req.body.content,
      post: req.params.id,
      user: req.user._id
    })

    await comment.save();

    await comment.populate({
      path: 'user',
      select: 'username avatar avatarUrl'
    })

    res.json({ comment });

  } catch (error) {
    next(error)
  }
}

exports.deleteOne = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      const err = new Error("Comment is not found")
      err.status = 404;
      throw err;
    }

    const userId = req.user._id;
    const isMaster = userId.toString() === comment.user.toString();

    if (!isMaster) {
      const err = new Error("Incorrect user");
      err.status = 400;
      throw err;
    }

    await comment.deleteOne();

    res.json({ comment });

  } catch (error) {
    next(error)
  }
}


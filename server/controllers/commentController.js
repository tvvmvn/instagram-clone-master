const Post = require("../models/Post");
const Comment = require("../models/Comment");
const createError = require("http-errors");


/* 
  Comment controller

  1 find
  2 create
  3 deleteOne
*/


exports.find = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    const where = { post: post._id };

    const comments = await Comment
      .find(where)
      .populate({
        path: "user",
        select: "username avatar avatarUrl"
      })
      .sort({ createdAt: "desc" })

    const commentCount = await Comment.countDocuments(where);

    res.json({ comments, commentCount });

  } catch (error) {
    next(error)
  }
}


exports.create = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new createError.NotFound("Post is not found");
    }

    const comment = new Comment({
      content: req.body.content,
      post: post._id,
      user: req.user._id
    })

    await comment.save();

    await comment.populate({
      path: "user",
      select: "username avatar avatarUrl"
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
      throw new createError.NotFound("Comment is not found");
    }

    const isMaster = req.user._id.toString() === comment.user.toString();

    if (!isMaster) {
      throw new createError.BadRequest("Incorrect user");
    }

    await comment.deleteOne();

    res.json({ comment });

  } catch (error) {
    next(error)
  }
}


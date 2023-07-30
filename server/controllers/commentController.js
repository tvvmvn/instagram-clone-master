const Article = require('../models/Article');
const Comment = require('../models/Comment');

exports.find = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    const where = { article: article._id };
    const limit = req.query.limit || 10;
    const skip = req.query.skip || 0;

    const commentCount = await Comment.count(where);
    const comments = await Comment
      .find(where)
      .populate({
        path: 'author',
        select: 'username avatar'
      })
      .sort({ created: 'desc' })
      .limit(limit)
      .skip(skip)

    res.json({ comments, commentCount });

  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const _comment = new Comment({
      article: req.params.id,
      content: req.body.content,
      author: req.user._id
    })

    await _comment.save();

    const comment = await _comment
      .populate({
        path: 'author',
        select: 'username avatar'
      })

    res.json({ comment });

  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const comment = await Comment
      .findById(req.params.id);

    if (!comment) {
      const err = new Error("Comment not found")
      err.status = 404;
      throw err;
    }

    const userId = req.user._id;
    const isAuthor = userId.toString() === comment.author.toString();

    if (!isAuthor) {
      const err = new Error("incorrect user");
      err.status = 400;
      throw err;
    }

    await comment.delete();

    res.json({ comment });

  } catch (error) {
    next(error)
  }
}


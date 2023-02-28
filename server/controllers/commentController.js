const User = require('../models/User');
const Article = require('../models/Article');
const Comment = require('../models/Comment');

exports.comments = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    const where = { article: article._id };
    const limit = req.query.limit || 10;
    const skip = req.query.skip || 0;

    const commentCount = await Comment.count(where);
    const _comments = await Comment
      .find(where)
      .sort({ created: 'desc' })
      .limit(limit)
      .skip(skip)

    const comments = [];

    for (let _comment of _comments) {
      const user = await User.findById(_comment.author);

      const comment = {
        id: _comment._id,
        content: _comment.content,
        author: {
          username: user.username,
          image: user.image
        },
        created: _comment.created,
      }

      comments.push(comment);
    }

    res.json({ comments, commentCount });

  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {

    const article = await Article.findById(req.params.id);

    const _comment = new Comment({
      article: article._id,
      content: req.body.content,
      author: req.user._id
    })

    await _comment.save();

    const user = await User.findById(_comment.author);

    const comment = {
      id: _comment._id,
      content: _comment.content,
      author: {
        username: user.username,
        image: user.image
      },
      created: _comment.created,
    }

    res.json({ comment });

  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {

    const comment = await Comment
      .findById(req.params.id);

    if (req.user._id.toString() !== comment.author.toString()) {
      const err = new Error("User is not correct");
      err.status = 400;
      throw err;
    }

    await comment.delete();

    res.json({ comment });

  } catch (error) {
    next(error)
  }
}


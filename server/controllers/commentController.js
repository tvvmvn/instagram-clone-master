const Article = require('../models/Article');
const Comment = require('../models/Comment');

exports.comments = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const article = await Article.findOne({ slug });

    const where = { article: article._id };
    const limit = req.query.limit;
    const skip = req.query.skip;

    const commentCount = await Comment.count(where);

    const _comments = await Comment
      .find(where)
      .populate('author')
      .sort({ created: 'desc' })
      .limit(limit)
      .skip(skip)

    console.log(_comments)

    const comments = [];

    for (let _comment of _comments) {

      const comment = {
        id: _comment._id,
        content: _comment.content,
        author: {
          username: _comment.author.username,
          image: _comment.author.image
        },
        created: _comment.date,
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
    const slug = req.params.slug;
    const content = req.body.content;

    const article = await Article.findOne({ slug });

    const newComment = new Comment({
      article: article._id,
      content: content,
      author: req.user._id
    })

    await newComment.save();

    const _comment = await newComment
      .populate('author')

    const comment = {
      id: _comment._id,
      content: _comment.content,
      author: {
        username: _comment.author.username,
        image: _comment.author.image
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
    const slug = req.params.slug;
    const id = req.params.id;
    
    const article = await Article.findOne({ slug });

    const comment = await Comment
      .findOne({ article: article._id, _id: id });

    if (req.user._id.toString() !== comment.author.toString()) {
      const err = new Error("User not match");
      err.status = 400;
      throw err;
    }

    await comment.delete();

    res.json({ id })

  } catch (error) {
    next(error)
  }
}


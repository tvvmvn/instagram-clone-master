exports.favorite = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const id = req.params.id;
    const comment = await Comment.findById(id);
    const favoriteComment = await FavoriteComment
    .findOne({ user: loginUser._id, comment: comment._id });

    if (favoriteComment) {
      const err = new Error("Already favorite article");
      err.status = 400;
      throw err;
    }

    const newFavoriteComment = new FavoriteComment({
      user: loginUser._id,
      comment: comment._id
    })

    await newFavoriteComment.save();

    comment.favoriteCount++;

    await comment.save();

    res.end();

  } catch (error) {
    next(error)
  }
}

exports.unfavorite = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const id = req.params.id;
    const comment = await Comment.findById(id)
    const favoriteComment = await FavoriteComment
      .findOne({user: loginUser._id, comment: comment._id});

    if (!favoriteComment) {
      const err = new Error("No comment to unfavorite");
      err.status = 400;
      throw err;
    }

    await favoriteComment.delete();

    comment.favoriteCount--;
    await comment.save();

    res.end();

  } catch (error) {
    next(error)
  }
}

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const FavoriteCommentSchema = new Schema({
  user: {type: Schema.ObjectId, required: true},
  comment: {type: Schema.ObjectId, required: true}
})

module.exports = mongoose.model('FavoriteComment', FavoriteCommentSchema)
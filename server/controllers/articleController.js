const User = require('../models/User');
const Follow = require('../models/Follow');
const Article = require('../models/Article');
const Favorite = require('../models/Favorite');
const fileHandler = require('../utils/fileHandler');

exports.feed = async (req, res, next) => {
  try {

    const follows = await Follow.find({ follower: req.user._id });
    const followings = follows.map(follow => follow.following);

    const where = { author: [...followings, req.user._id] }
    const limit = req.query.limit || 5;
    const skip = req.query.skip || 0;

    const articleCount = await Article.count(where);
    const articles = await Article
      .find(where)
      .populate({
        path: 'author',
        select: 'username avatar'
      })
      .populate({
        path: 'isFavorite'
      })
      .populate({
        path: 'commentCount'
      })
      .sort({ created: 'desc' })
      .skip(skip)
      .limit(limit)

    res.json({ articles, articleCount });

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
      where.author = user._id;
    }

    const articleCount = await Article.count(where);
    const articles = await Article
      .find(where, 'photos favoriteCount created')
      .populate({
        path: 'commentCount'
      })
      .sort({ created: 'desc' })
      .limit(limit)
      .skip(skip)

    res.json({ articles, articleCount });

  } catch (error) {
    next(error)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const article = await Article
      .findById(req.params.id)
      .populate({
        path: 'author',
        select: 'username avatar'
      })
      .populate({
        path: 'isFavorite'
      })
      .populate({
        path: 'commentCount'
      })

    if (!article) {
      const err = new Error("Article not found");
      err.status = 404;
      throw err;
    }

    res.json({ article });

  } catch (error) {
    next(error)
  }
}

exports.create = [
  fileHandler('articles').array('photos'),
  async (req, res, next) => {
    try {
      
      const files = req.files;

      if (files.length < 1) {
        const err = new Error('File is required');
        err.status = 400;
        throw err;
      }

      const photos = files.map(file => file.filename);

      const article = new Article({
        photos,
        description: req.body.description,
        author: req.user._id
      });

      await article.save();

      res.json({ article });

    } catch (error) {
      next(error)
    }
  }
]

exports.delete = async (req, res, next) => {
  try {

    const article = await Article.findById(req.params.id);

    if (!article) {
      const err = new Error("Article not found")
      err.status = 404;
      throw err;
    }

    if (req.user._id.toString() !== article.author.toString()) {
      const err = new Error("Author is not correct")
      err.staus = 400;
      throw err;
    }

    await article.delete();

    res.json({ article });

  } catch (error) {
    next(error)
  }
}

exports.favorite = async (req, res, next) => {
  try {

    const article = await Article.findById(req.params.id);

    if (!article) {
      const err = new Error("Article not found");
      err.status = 404;
      throw err;
    }

    const _favorite = await Favorite
      .findOne({ user: req.user._id, article: article._id })

    if (!_favorite) {
      const favorite = new Favorite({
        user: req.user._id,
        article: article._id
      })
      await favorite.save();
  
      article.favoriteCount++;
      await article.save();
    }

    res.json({ article })

  } catch (error) {
    next(error)
  }
}

exports.unfavorite = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      const err = new Error("Article not found");
      err.status = 404;
      throw err;
    }

    const favorite = await Favorite
      .findOne({ user: req.user._id, article: article._id });

    if (favorite) {
      await favorite.delete();

      article.favoriteCount--;
      await article.save();
    }

    res.json({ article });

  } catch (error) {
    next(error)
  }
}
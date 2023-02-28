const User = require('../models/User');
const Follow = require('../models/Follow');
const Article = require('../models/Article');
const Favorite = require('../models/Favorite');
const Comment = require('../models/Comment');
const fileHandler = require('../utils/fileHandler');

exports.feed = async (req, res, next) => {
  try {

    const follows = await Follow.find({ follower: req.user._id });
    const followings = follows.map(follow => follow.following);

    const where = { author: [...followings, req.user._id] }
    const limit = req.query.limit || 5;
    const skip = req.query.skip || 0;

    const articleCount = await Article.count(where);
    const _articles = await Article
      .find(where)
      .sort({ created: 'desc' })
      .skip(skip)
      .limit(limit)

    const articles = [];

    for (let _article of _articles) {
      const favorite = await Favorite
        .findOne({ user: req.user._id, article: _article._id });
      const commentCount = await Comment
        .count({ article: _article._id });
      const user = await User.findById(_article.author);

      const article = {
        images: _article.images,
        description: _article.description,
        displayDate: _article.displayDate, // virtual
        author: {
          username: user.username,
          image: user.image
        },
        favoriteCount: _article.favoriteCount,
        isFavorite: !!favorite,
        commentCount,
        id: _article._id
      }

      articles.push(article);
    }

    res.json({ articles, articleCount });

  } catch (error) {
    next(error)
  }
}

exports.articles = async (req, res, next) => {
  try {
    const where = {}
    const limit = req.query.limit || 9
    const skip = req.query.skip || 0

    if ('username' in req.query) {
      const user = await User.findOne({ username: req.query.username });
      where.author = user._id;
    }

    const articleCount = await Article.count(where);
    const _articles = await Article
      .find(where)
      .sort({ created: 'desc' })
      .limit(limit)
      .skip(skip)

    const articles = [];

    for (let _article of _articles) {

      const favoriteCount = await Favorite.count({ article: _article._id });
      const commentCount = await Comment.count({ article: _article._id });

      const article = {
        images: _article.images,
        favoriteCount,
        commentCount,
        id: _article._id,
      }

      articles.push(article);
    }

    res.json({ articles, articleCount });

  } catch (error) {
    next(error)
  }
}

exports.article = async (req, res, next) => {
  try {
    const _article = await Article
      .findById(req.params.id)

    if (!_article) {
      const err = new Error("Article not found");
      err.status = 404;
      throw err;
    }

    const favorite = await Favorite
      .findOne({ user: req.user._id, article: _article._id });
    const commentCount = await Comment.count({ article: _article._id });
    const user = await User.findById(_article.author);

    const article = {
      images: _article.images,
      description: _article.description,
      displayDate: _article.displayDate,
      author: {
        username: user.username,
        image: user.image,
      },
      favoriteCount: _article.favoriteCount,
      isFavorite: !!favorite,
      commentCount,
      id: _article._id
    }

    res.json({ article });

  } catch (error) {
    next(error)
  }
}

exports.create = [
  fileHandler('articles').array('images'),
  async (req, res, next) => {
    try {
      
      const files = req.files;

      if (files.length < 1) {
        const err = new Error('File is required');
        err.status = 400;
        throw err;
      }

      const images = files.map(file => file.filename);

      const article = new Article({
        images,
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

    const article = await Article
      .findById(req.params.id);

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

    const favorite = await Favorite
      .findOne({ user: req.user._id, article: article._id })

    if (favorite) {
      const err = new Error("Already favorite article");
      err.status = 400;
      throw err;
    }

    const newFavorite = new Favorite({
      user: req.user._id,
      article: article._id
    })
    await newFavorite.save();

    article.favoriteCount++;
    await article.save();

    res.json({ article })

  } catch (error) {
    next(error)
  }
}

exports.unfavorite = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    const favorite = await Favorite
      .findOne({ user: req.user._id, article: article._id });

    if (!favorite) {
      const err = new Error("Not favorite article");
      err.status = 400;
      throw err;
    }

    await favorite.delete();

    article.favoriteCount--;
    await article.save();

    res.json({ article });

  } catch (error) {
    next(error)
  }
}
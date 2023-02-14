const User = require('../models/User');
const Follow = require('../models/Follow');
const Article = require('../models/Article');
const Favorite = require('../models/Favorite');
const Comment = require('../models/Comment');
const fileHandler = require('../utils/fileHandler');

exports.feed = async (req, res, next) => {
  try {
    const loginUser = req.user;

    const follows = await Follow.find({ follower: loginUser._id });
    const followings = follows.map(follow => follow.following); 

    const where = { author: [...followings, loginUser._id] }
    const limit = req.query.limit;
    const skip = req.query.skip;

    const articleCount = await Article.count(where);

    const _articles = await Article
      .find(where)
      .sort({ created: 'desc' })
      .populate({
        path: 'author',
        select: 'username image -_id'
      })
      .skip(skip)
      .limit(limit)

    const articles = [];

    for (let _article of _articles) {
      const favorite = await Favorite
        .findOne({ user: loginUser._id, article: _article._id });

      const commentCount = await Comment
        .count({ article: _article._id });

      const article = {
        images: _article.images,
        description: _article.description,
        created: _article.date, // virtual
        author: _article.author,
        favoriteCount: _article.favoriteCount,
        isFavorite: !!favorite,
        commentCount,
        slug: _article.slug,
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
    const limit = req.query.limit
    const skip = req.query.skip

    if (req.query.username) {
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

      const favoriteCount = await Favorite.count({article: _article._id});
      const commentCount = await Comment.count({article: _article._id});

      const article = {
        images: _article.images,
        slug: _article.slug,
        favoriteCount,
        commentCount
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
    const loginUser = req.user;
    const slug = req.params.slug;

    const _article = await Article
      .findOne({ slug })
      .populate('author')

    if (!_article) {
      const err = new Error("Article not found");
      err.status = 404;
      throw err;
    }

    const favorite = await Favorite
      .findOne({ user: loginUser._id, article: _article._id });

    const commentCount = await Comment.count({ article: _article._id });

    const article = {
      images: _article.images,
      description: _article.description,
      created: _article.date,
      author: {
        username: _article.author.username,
        image: _article.author.image
      },
      favoriteCount: _article.favoriteCount,
      isFavorite: !!favorite,
      commentCount,
      slug: _article.slug,
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

      const article = new Article();
      article.description = req.body.description;
      article.images = images;
      article.author = req.user._id;
      article.slugify(files[0].originalname);
  
      await article.save();

      res.json({ article });

    } catch (error) {
      next(error)
    }
  }
]

exports.delete = async (req, res, next) => {
  try {

    const loginUser = req.user;
    const slug = req.params.slug;
    const article = await Article
      .findOne({ slug });

    if (loginUser._id.toString() !== article.author.toString()) {
      const err = new Error("User not match")
      err.staus = 400;
      throw err;
    }

    if (!article) {
      const err = new Error("Article not found")
      err.status = 404;
      throw err;
    }

    await article.delete();

    res.json({ slug });

  } catch (error) {
    next(error)
  }
}

exports.favorite = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const slug = req.params.slug;

    const article = await Article.findOne({ slug })

    const favorite = await Favorite
      .findOne({ user: loginUser._id, article: article._id })

    if (favorite) {
      const err = new Error("Already favorite article");
      err.status = 400;
      throw err;
    }

    const newFavorite = new Favorite({
      user: loginUser._id,
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
    const loginUser = req.user;
    const slug = req.params.slug

    const article = await Article.findOne({ slug })

    const favorite = await Favorite
      .findOne({ user: loginUser._id, article: article._id });

    if (!favorite) {
      const err = new Error("No article to unfavorite");
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
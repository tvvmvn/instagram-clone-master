const { Follow, Article, Favorite } = require("../models/model");
const formidable = require("formidable");
const fs = require("fs");

exports.feed = async (req, res, next) => {
  try {
    const loginUser = req.user;
    
    // get articles from users followed by user and login user.
    const follows = await Follow.find({ follower: loginUser._id });
    const users = [...follows.map(follow => follow.following), loginUser._id];

    const articles = await Article
      .find({ user: {$in: users}})
      .sort([["created", "descending"]])
      .populate("user")
      .skip(req.query.skip)
      .limit(req.query.limit)
      .lean();

    // add property 'isFavorite' to article data
    for (let article of articles) {
      const favorite = await Favorite
        .findOne({ user: loginUser._id, article: article._id });

      article.isFavorite = !!favorite;
    }

    res.json(articles)

  } catch (error) {
    next(error)
  }
}

exports.article_list = async (req, res, next) => {
  try {
    // get all articles from collection
    const articles = await Article.find()
      .sort([["created", "descending"]])
      .populate("user")
      .skip(req.query.skip)
      .limit(req.query.limit);

      res.json(articles);

  } catch (error) {
    next(error)
  }
}

exports.article = async (req, res, next) => {
  try {   
    const loginUser = req.user;

    // get id from req.params (request url)
    const id = req.params.id;
    const article = await Article
      .findById(id)
      .populate("user")
      .lean();
    
    // when article does not exist.
    if (!article) {
      const err = new Error("Article not found");
      err.status = 404;
      return next(err);
    }

    // add property 'isFavorite' to article data
    // isFavorite: show user's favorite article or not
    const favorite = await Favorite
      .findOne({ user: loginUser._id, article: article._id }); 
    article.isFavorite = !!favorite;

    res.json(article);
 
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  const form = formidable({ multiples: true });
  
  form.parse(req, async (err, fields, files) => {
    try { 
      const loginUser = req.user;

      if (err) {
        return next(err);
      }

      const images = files.images instanceof Array ? files.images : new Array(files.images);

      // when no image is uploaded.
      if (!images[0].originalFilename) {
        const err = new Error("image must be specified");
        err.status = 400;
        return next(err);
      }

      // validate image...
      // size, type, ...
      
      // save images from client to data directory
      const photos = images.map(photo => {
        const oldPath = photo.filepath;
        const ext = photo.originalFilename.split(".")[1]
        const newName = photo.newFilename + "." + ext;
        const newPath = `${__dirname}/../data/articles/${newName}`;
        fs.renameSync(oldPath, newPath);

        return newName;
      })
          
      // save new article
      const article = new Article({
        description: fields.description,
        photos,
        user: loginUser._id
      })
      await article.save();

      res.json(article);

    } catch (error) {
      next(error)
    }
  });
}

exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await Article
      .findById(id);

    // when article does not exist.
    if (!article) {
      const err = new Error("Article not found")
      err.status = 404;
      return next(err);
    }
    
    await article.delete();
    
    res.end();

  } catch (error) {
    next(error)
  }
}

exports.favorite = async (req, res, next) => {
  try { 
    const loginUser = req.user;
    const id = req.params.id;

    const article = await Article.findById(id);
    
    // already favorite article
    const favorite = await Favorite
      .findOne({ user: loginUser._id, article: article._id })

    if (favorite) {
      const err = new Error("Already favorite article");
      err.status = 400;
      return next(err)
    }

    // save new favorite data
    const newFavorite = new Favorite({
      user: loginUser._id,
      article: article._id
    })
    await newFavorite.save();

    // increment favorite count of an article
    article.favoriteCount++;
    await article.save();

    // response end (status code: 200 OK)
    res.end();

  } catch (error) {
    next(error)
  }
}

exports.unfavorite = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const id = req.params.id
    
    const article = await Article.findById(id)
    
    // when unfavorite article
    const favorite = await Favorite
      .findOne({ user: loginUser._id, article: article._id });

    if (!favorite) {
      const err = new Error("No article to unfavorite");
      err.status = 400;
      return next(err);
    }

    // delete favorite data
    await favorite.delete();

    // decrement favorite count of an article.
    article.favoriteCount--;
    await article.save();

    res.end();

  } catch (error) {
    next(error)
  }
}
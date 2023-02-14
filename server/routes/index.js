const express = require('express')
const router = express.Router();
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });
require("../auth/passportJWT");
const articleController = require("../controllers/articleController");
const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");

// INDEX
router.get('/', (req, res) => {
  res.json({ message: "hello express" });
})

// USERS
router.get('/users', auth, userController.users);
router.post('/users', userController.register);
// router.get('/users/:username', userController.username);
// router.get('/users/:email', userController.email);
router.get('/user', auth, userController.user); 
router.put('/user', auth, userController.edit);
router.post('/user/login', userController.login);

// ARTICLES 
router.get('/feed', auth, articleController.feed)
router.get('/articles', auth, articleController.articles)
router.post('/articles', auth, articleController.create)
router.get('/articles/:slug', auth, articleController.article)
router.delete('/articles/:slug', auth, articleController.delete)
router.post('/articles/:slug/favorite', auth, articleController.favorite)
router.delete('/articles/:slug/favorite', auth, articleController.unfavorite)

// COMMENTS
router.get('/articles/:slug/comments', auth, commentController.comments)
router.post('/articles/:slug/comments', auth, commentController.create)
router.delete('/articles/:slug/comments/:id', auth, commentController.delete)

// PROFILES
router.get('/profiles/:username', auth, profileController.details)
router.post('/profiles/:username/follow', auth, profileController.follow)
router.delete('/profiles/:username/follow', auth, profileController.unfollow)

module.exports = router;

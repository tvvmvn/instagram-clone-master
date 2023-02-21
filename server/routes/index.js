const express = require('express')
const router = express.Router();
const passport = require("passport");
const jwtStrategy = require("../auth/jwtStrategy");
const articleController = require("../controllers/articleController");
const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");

passport.use(jwtStrategy);
const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    req.user = user;  
    next();

  })(req, res, next);
} 

/* INDEX */ 
router.get('/', (req, res) => {
  res.json({ message: "API Server - INDEX PAGE" });
})

// router.get('/test', auth, (req, res, next) => {
//   res.json({ user: req.user });
// });

/* USERS */
router.get('/users', auth, userController.users);
router.post('/users', userController.register);
router.get('/user', auth, userController.account); 
router.put('/user', auth, userController.accountEdit);
router.post('/user/login', userController.login);

/* ARTICLES */
router.get('/feed', auth, articleController.feed)
router.get('/articles', auth, articleController.articles)
router.post('/articles', auth, articleController.create)
router.get('/articles/:id', auth, articleController.article)
router.delete('/articles/:id', auth, articleController.delete)
router.post('/articles/:id/favorite', auth, articleController.favorite)
router.delete('/articles/:id/favorite', auth, articleController.unfavorite)

/* COMMENTS */
router.get('/articles/:id/comments', auth, commentController.comments)
router.post('/articles/:id/comments', auth, commentController.create)
router.delete('/comments/:id', auth, commentController.delete)

/* PROFILES */
router.get('/profiles/:username', auth, profileController.details)
router.post('/profiles/:username/follow', auth, profileController.follow)
router.delete('/profiles/:username/follow', auth, profileController.unfollow)

module.exports = router;

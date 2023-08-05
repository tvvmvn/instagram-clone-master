const express = require('express')
const router = express.Router();
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });
const jwtStrategy = require("../auth/jwtStrategy");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");

passport.use(jwtStrategy);

/* INDEX */ 
router.get('/', (req, res) => {
  res.json({ message: "API Server - INDEX PAGE" });
})

/* USER */
router.post('/users', userController.create); 
router.post('/user/login', userController.login); 

/* POST */
router.get('/feed', auth, postController.feed) 
router.get('/posts', auth, postController.find)
router.post('/posts', auth, postController.create)  
router.get('/posts/:id', auth, postController.findOne)
router.delete('/posts/:id', auth, postController.delete) 
router.post('/posts/:id/like', auth, postController.like) 
router.delete('/posts/:id/unlike', auth, postController.unlike)

/* COMMENT */
router.get('/posts/:id/comments', auth, commentController.find) 
router.post('/posts/:id/comments', auth, commentController.create) 
router.delete('/comments/:id', auth, commentController.delete) 

/* PROFILE */
router.put('/profiles', auth, profileController.update); 
router.get('/profiles', auth, profileController.find); 
router.get('/profiles/:username', auth, profileController.findOne)
router.post('/profiles/:username/follow', auth, profileController.follow) 
router.delete('/profiles/:username/unfollow', auth, profileController.unfollow)

module.exports = router;

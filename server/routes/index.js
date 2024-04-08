const express = require("express")
const router = express.Router();
const auth = require("../middlewares/auth");
const loginValidator = require("../middlewares/loginValidator");
const signUpValidator = require("../middlewares/signUpValidator");
const upload = require("../middlewares/upload");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const profileController = require("../controllers/profileController");


/* 
  Router

  It connects request with proper resources
*/


// index page
router.get("/", (req, res) => {
  res.json({ message: "Hello Client!" });
})

// User router 
router.post("/users", signUpValidator, userController.create);
router.post("/users/login", loginValidator, userController.login);
router.put("/users/user", auth, upload.single("avatar"), userController.update);

// Post router 
router.get("/posts/feed", auth, postController.feed)
router.get("/posts", auth, postController.find)
router.post("/posts", auth, upload.array("photos", 10), postController.create)
router.get("/posts/:id", auth, postController.findOne)
router.delete("/posts/:id", auth, postController.deleteOne)
router.post("/posts/:id/like", auth, postController.like)
router.delete("/posts/:id/unlike", auth, postController.unlike)

// Comment router 
router.get("/posts/:id/comments", auth, commentController.find)
router.post("/posts/:id/comments", auth, commentController.create)
router.delete("/posts/comments/:id", auth, commentController.deleteOne)

// Profile router 
router.get("/profiles", auth, profileController.find);
router.get("/profiles/:username", auth, profileController.findOne)
router.post("/profiles/:username/follow", auth, profileController.follow)
router.delete("/profiles/:username/unfollow", auth, profileController.unfollow)


module.exports = router;


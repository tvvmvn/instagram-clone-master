const express = require("express")
const router = express.Router();
const userRouter = require("./user");
const postRouter = require("./post");
const commentRouter = require("./comment");
const profileRouter = require("./profile");
const auth = require("../middleware/auth");


/* 
  Router

  It connects request with proper resources

  1 User router
  2 Post router
  3 Comment router
  4 Profile router
*/


// index page
router.get("/", (req, res) => {
  res.json({ message: "Hello Client!" });
})

// User router 
router.use("/users", userRouter);

// Post router 
router.use("/posts", auth, postRouter);

// Comment router 
router.use("/posts", auth, commentRouter);

// Profile router 
router.use("/profiles", auth, profileRouter);


module.exports = router;


const express = require("express")
const router = express.Router();
const userRouter = require("./user");
const postRouter = require("./post");
const commentRouter = require("./comment");
const profileRouter = require("./profile");
const auth = require("../middleware/auth");


/* 
  Routing
  connecting url with proper resource

  1 how to route
  router.httpRequestMethod(url, controller)

  2 Router hierachy of server

  indexRouter 
      userRouter
      postRotuer
      commentRouter
      profileRouter
*/


// index page
router.get("/", (req, res) => {
  res.json({ message: "hello client" });
})


// User Router 
router.use("/users", userRouter);
// Post Router 
router.use("/posts", auth, postRouter);
// Comment Router 
router.use("/posts", auth, commentRouter);
// Profile Router 
router.use("/profiles", auth, profileRouter);


module.exports = router;


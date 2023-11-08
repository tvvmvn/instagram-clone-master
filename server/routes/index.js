const express = require("express")
const router = express.Router();
const usersRouter = require("./users");
const postsRouter = require("./posts");
const profilesRouter = require("./profiles");
const auth = require("../middleware/auth");


/* 
  Routing
  connecting url with proper resource

  1 how to route
  router.httpRequestMethod(url, controller)
  
  2 HTTP Request Methods
  
  1) GET
  Read data
  2) POST
  Create data
  3) PUT
  Update data
  4) DELETE
  Delete data
*/


// index page
router.get("/", (req, res) => {
  res.json({ message: "hello client" });
})


/* User Router */
router.use("/users", usersRouter)
/* Post Router */
router.use("/posts", auth, postsRouter)
/* Profile Router */
router.use("/profiles", auth, profilesRouter)


module.exports = router;


const express = require("express")
const router = express.Router();
const usersRouter = require("./users");
const postsRouter = require("./posts");
const profilesRouter = require("./profiles");
const auth = require("../middleware/auth");

/* INDEX */
router.get("/", (req, res) => {
  res.json({ message: "hello client" });
})

/* 
  HTTP Request Method

  1 GET
  Read data
  2 POST
  Create data
  3 PUT
  Update data
  4 DELETE
  Delete data
*/

/* USERS */
router.use("/users", usersRouter)
/* POSTS */
router.use("/posts", auth, postsRouter)
/* PROFILES */
router.use("/profiles", auth, profilesRouter)

module.exports = router;


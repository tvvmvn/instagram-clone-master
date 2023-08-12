const express = require('express')
const router = express.Router();
const usersRouter = require("./users");
const postsRouter = require("./posts");
const profilesRouter = require("./profiles");

/* INDEX */
router.get('/', (req, res) => {
  res.json({ message: "hello client" });
})

router.use('/users', usersRouter)
router.use('/posts', postsRouter)
router.use('/profiles', profilesRouter)

module.exports = router;


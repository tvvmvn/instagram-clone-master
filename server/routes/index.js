const express = require('express')
const router = express.Router();
const usersRouter = require("./users");
const postsRouter = require("./posts");
const profilesRouter = require("./profiles");
const auth = require("../middleware/auth");

/* INDEX */
router.get('/', (req, res) => {
  res.json({ message: "hello client" });
})

router.use('/users', usersRouter)
router.use('/posts', auth, postsRouter)
router.use('/profiles', auth, profilesRouter)

module.exports = router;


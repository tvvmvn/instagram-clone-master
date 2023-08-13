const express = require('express')
const router = express.Router();
const { 
  update, 
  find, 
  findOne, 
  follow, 
  unfollow 
} = require("../controllers/profileController");
const upload = require("../utils/upload");
const auth = require("../auth/auth");

router.put('/', auth, upload.single('avatar'), update);
router.get('/', auth, find);
router.get('/:username', auth, findOne)
router.post('/:username/follow', auth, follow)
router.delete('/:username/unfollow', auth, unfollow)

module.exports = router;
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

router.put('/', upload.single('avatar'), update);
router.get('/', find);
router.get('/:username', findOne)
router.post('/:username/follow', follow)
router.delete('/:username/unfollow', unfollow)

module.exports = router;
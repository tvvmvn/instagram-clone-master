const express = require('express')
const router = express.Router();
const {
  feed, 
  find,
  create,
  findOne,
  deleteOne,
  like,
  unlike
} = require("../controllers/postController");
const commentController = require('../controllers/commentController');
const photoUpload = require("../utils/photoUpload");
const auth = require("../auth/auth");

// posts
router.get('/feed', auth, feed)
router.get('/', auth, find)
router.post('/', auth, photoUpload, create)
router.get('/:id', auth, findOne)
router.delete('/:id', auth, deleteOne)
router.post('/:id/like', auth, like)
router.delete('/:id/unlike', auth, unlike)

// comments
router.get('/:id/comments', auth, commentController.find)
router.post('/:id/comments',auth, commentController.create)
router.delete('/comments/:id', auth, commentController.deleteOne)

module.exports = router;
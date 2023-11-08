const express = require("express")
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
const commentController = require("../controllers/commentController");
const upload = require("../middleware/upload");


/*
Post router
*/


router.get("/feed", feed)
router.get("/", find)
router.post("/", upload.array("photos", 10), create)
router.get("/:id", findOne)
router.delete("/:id", deleteOne)
router.post("/:id/like", like)
router.delete("/:id/unlike", unlike)


/* 
Comment router
*/


router.get("/:id/comments", commentController.find)
router.post("/:id/comments", commentController.create)
router.delete("/comments/:id", commentController.deleteOne)


module.exports = router;
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
const upload = require("../middleware/upload");


/*
  Post Router
*/


router.get("/feed", feed)
router.get("/", find)
router.post("/", upload.array("photos", 10), create)
router.get("/:id", findOne)
router.delete("/:id", deleteOne)
router.post("/:id/like", like)
router.delete("/:id/unlike", unlike)


module.exports = router;
const express = require("express");
const router = express.Router();
const {
  find,
  create,
  deleteOne
} = require("../controllers/commentController");


/*
  Comment Router
*/


router.get("/:id/comments", find)
router.post("/:id/comments", create)
router.delete("/comments/:id", deleteOne)

module.exports = router;

const express = require("express")
const router = express.Router();
const { 
  create, 
  login,
  update
} = require("../controllers/userController");
const signUpValidator = require("../middleware/signUpValidator");
const loginValidator = require("../middleware/loginValidator");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

router.post("/", signUpValidator, create);
router.post("/login", loginValidator, login);
router.put("/user", auth, upload.single("avatar"), update);

module.exports = router;
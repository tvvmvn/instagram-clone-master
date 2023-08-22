const express = require('express')
const router = express.Router();
const { 
  create, 
  login,
  update
} = require("../controllers/userController");
const signUpValidator = require('../utils/signUpValidator');
const loginValidator = require('../utils/loginValidator');
const upload = require("../utils/upload");
const auth = require("../auth/auth");

router.post('/', signUpValidator, create);
router.post('/login', loginValidator, login);
router.put('/user', auth, upload.single('avatar'), update);

module.exports = router;
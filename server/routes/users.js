const express = require('express')
const router = express.Router();
const { 
  create, 
  login 
} = require("../controllers/userController");
const signUpValidator = require('../utils/signUpValidator');
const loginValidator = require('../utils/loginValidator');

router.post('/', signUpValidator, create);
router.post('/login', loginValidator, login);

module.exports = router;
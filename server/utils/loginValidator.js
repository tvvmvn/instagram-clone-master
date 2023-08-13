const User = require('../models/User');
const { body, validationResult } = require('express-validator');

module.exports = async (req, res, next) => {
  try {
    const doesEmailExists = async (email) => {
      const user = await User.findOne({ email });
    
      if (!user) {
        return Promise.reject('E-mail does not exists');
      }
    }
    
    const doesPasswordMatch = async (password, { req }) => {
      const email = req.body.email;
      const user = await User.findOne({ email });
      
      if (!user.checkPassword(password)) {
        return Promise.reject('Password does not match');
      }
    }
    
    const validations =[
      body('email').isEmail()
        .custom(doesEmailExists),
      body('password').trim().notEmpty()
        .custom(doesPasswordMatch),
    ]

    for (let validation of validations) {
      const result = await validation.run(req);
  
      if (result.errors.length) break;
    }
  
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const err = new Error();
      err.errors = errors.array();
      err.status = 400;
      throw err;
    }
    
    next();

  } catch (error) {
    next(error)
  }
}
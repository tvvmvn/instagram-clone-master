const User = require('../models/User');
const { body } = require('express-validator');
const createError = require('http-errors');

module.exports = async (req, res, next) => {
  try {
    const emailResult = await body('email')
      .isEmail()
      .custom(async (email) => {
        const user = await User.findOne({ email });

        if (!user) {
          throw new createError.Unauthorized("E-mail does not exists");
        }
      })
      .run(req);
      
    if (!emailResult.isEmpty()) {
      throw new createError.Unauthorized("E-mail validation failed");
    }
    
    const passwordResult = await body('password')
      .trim()
      .notEmpty()
      .custom(async (password, { req }) => {
        const email = req.body.email;
        const user = await User.findOne({ email });
        
        if (!user.checkPassword(password)) {
          throw new createError.Unauthorized("Password does not match");
        }
      })
      .run(req)

    if (!passwordResult.isEmpty()) {
      // console.log(passwordResult.errors)
      throw new createError.Unauthorized("Password validation failed");
    }

    next();

  } catch (error) {
    next(error)
  }
}
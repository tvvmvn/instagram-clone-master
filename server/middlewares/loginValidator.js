const User = require("../models/User");
const { body } = require("express-validator");
const createError = require("http-errors");


/*
  Validation for login form data 

  1 email check
  2 password check
*/


module.exports = async (req, res, next) => {
  try {
    // email check
    const emailResult = await body("email")
      .isEmail()
      .custom(async (email) => {
        const user = await User.findOne({ email });

        if (!user) {
          throw new createError.Unauthorized("E-mail does not exists");
        }
      })
      .run(req);
      
    if (!emailResult.isEmpty()) {
      throw new createError.Unauthorized(emailResult.errors);
    }
    
    // password check
    const passwordResult = await body("password")
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
      throw new createError.Unauthorized(passwordResult.errors);
    }

    // calling next middleware
    next();

  } catch (error) {
    next(error)
  }
}
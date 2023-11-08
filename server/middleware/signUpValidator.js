const User = require("../models/User");
const { body } = require("express-validator");
const createError = require("http-errors");

module.exports = async (req, res, next) => {
  try {
    // email check
    const emailResult = await body("email")
      .isEmail()
      .custom(async (email) => {
        const user = await User.findOne({ email });
        
        if (user) {
          throw new Error("E-mail is already in use");
        }
      })
      .run(req);

    if (!emailResult.isEmpty()) {
      // console.log(emailResult)
      throw new createError.BadRequest("E-mail validataion failed");
    }

    
    // username check
    const usernameResult = await body("username")
      .trim()
      .isLength({ min: 5 })
      .isAlphanumeric()
      .custom(async (username) => {
        const user = await User.findOne({ username });
      
        if (user) {
          throw new Error("Username is already in use");
        }
      })
      .run(req);

    if (!usernameResult.isEmpty()) {
      throw new createError.BadRequest("Username validation failed");
    }


    // password check
    const passwordError = await body("password")
      .trim()
      .isLength({ min: 5 })
      .run(req);

    if (!passwordError.isEmpty()) {
      throw new createError.BadRequest("Password validation failed");
    }
    
    
    // call for next middleware
    next();
  
  } catch (error) {
    next(error)
  }
};
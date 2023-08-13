const User = require('../models/User');
const { body } = require('express-validator');

module.exports = async (req, res, next) => {
  try {
    const emailResult = await body('email')
      .isEmail()
      .custom(async (email) => {
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error('E-mail does not exists');
        }
      })
      .run(req);
      
    if (!emailResult.isEmpty()) {
      const err = new Error('E-mail validation failed');
      err.status = 400;
      throw err;
    }
    
    const passwordResult = await body('password')
      .trim()
      .notEmpty()
      .custom(async (password, { req }) => {
        const email = req.body.email;
        const user = await User.findOne({ email });
        
        if (!user.checkPassword(password)) {
          throw new Erorr('Password does not match');
        }
      })
      .run(req)

    if (!passwordResult.isEmpty()) {
      const err = new Error('Password validation failed');
      err.status = 400;
      throw err;
    }

    next();

  } catch (error) {
    next(error)
  }
}
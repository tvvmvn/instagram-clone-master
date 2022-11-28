const { User } = require("../models/model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const fs = require("fs");

exports.login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    // when user not found
    if (!user) {
      const err = new Error("User not found");
      err.status = 401;
      return next(err);
    }

    // encode password with user's salt
    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 310000, 32, "sha256")
      .toString("hex")
    
    // when password not match
    if (user.password !== hashedPassword) {
      const err = new Error("Password not match");
      err.status = 401;
      return next(err);
    }

    // # issue token 
    // save username data in token 
    // encode with secret key
    const token = jwt.sign({ username: user.username }, process.env.SECRET);

    res.json({ user, token })

  } catch (error) {
    next(error)
  }
}

exports.register = [
  // controller1: validate user data
  async (req, res, next) => {
    try {
      // data from client is stored in req.body
      const {username, email, password} = req.body;

      // validate username 
      { 
        // # send query to DATABASE (send request to DB for some work)
        const user = await User.findOne({username});
        
        // # custom error
        if (user) { 
          const err = new Error("Username must be unique");
          // HTTP response status codes: 400 (BadRequest)
          err.status = 400;
          return next(err);
        }
      }

      // validate email
      { 
        const user = await User.findOne({email});
        
        if (user) {
          const err = new Error("Email must be unique");
          err.status = 400;
          return next(err);
        }
      }
  
      // move to next controller
      next();

    } catch (error) {
      next(error)
    }
  },

  // controller 2: save user 
  async (req, res, next) => {
    try {
      const {username, email, password} = req.body;

      // # encode password
      // salt:
      // unique value saved with user data
      // used to encode and decode password
      const salt = crypto.randomBytes(16).toString("hex");
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 310000, 32, "sha256")
        .toString("hex")

      // # save data in DB
      // create instance of Model
      // call save() method
      const user = new User({
        username,
        email,
        password: hashedPassword,
        salt: salt
      })
      await user.save();

      res.json(user)

    } catch (error) {
      next(error)
    }
}]

exports.edit = async (req, res, next) => {
  try {    
    const loginUser = req.user;
    // get data from req.body
    const bio = req.body.bio;

    // update bio
    const user = await User.findById(loginUser._id);
    user.bio = bio;
    await user.save();
  
    res.json(user.bio);

  } catch (error) {
    next(error)
  }
}

exports.upload_image = async (req, res, next) => {
  // formidable(module): handling form with files
  const form = formidable({});
  
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return next(err);
      }

      const loginUser = req.user;
      const user = await User.findById(loginUser._id);
      
      // save image with generated name in directory 'data'
      const image = files.image;
      const oldPath = image.filepath;
      const ext = image.originalFilename.split(".")[1];
      const newName = image.newFilename + "." + ext;
      const newPath = `${__dirname}/../data/users/${newName}`;
      fs.renameSync(oldPath, newPath);

      // save image name into db
      user.image = newName;
      await user.save();
      
      res.json(newName);

    } catch (error) {
      next(error)
    }
  })
}

exports.delete_image = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const user = await User.findById(loginUser._id);

    // update image to null
    user.image = null;
    await user.save();

    res.end();

  } catch (error) {
    next(error)
  }
}
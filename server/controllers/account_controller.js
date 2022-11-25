const { User } = require("../models/model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const fs = require("fs");

exports.register = [
  // validate user data
  async (req, res, next) => {
    try {
      const {username, email, password} = req.body;

      { // validate username 
        const user = await User.findOne({username});
        
        if (user) {
          const err = new Error("Username must be unique");
          err.status = 400;
          return next(err);
        }
      }

      { // validate email
        const user = await User.findOne({email});
        
        if (user) {
          const err = new Error("Email must be unique");
          err.status = 400;
          return next(err);
        }
      }
  
      next();

    } catch (error) {
      next(error)
    }
  },

  async (req, res, next) => {
    // save user in DB
    try {
      const {username, email, password} = req.body;

      const salt = crypto.randomBytes(16).toString("hex");
      // encrypt password
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 310000, 32, "sha256")
        .toString("hex")

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

    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 310000, 32, "sha256")
      .toString("hex")
    
    // when assword not match
    if (user.password !== hashedPassword) {
      const err = new Error("Password not match");
      err.status = 401;
      return next(err);
    }

    // issue token 
    const token = jwt.sign({ username: user.username }, process.env.SECRET);

    res.json({ user, token })

  } catch (error) {
    next(error)
  }
}

exports.upload_image = async (req, res, next) => {
  const form = formidable({});
  
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return next(err);
      }

      const loginUser = req.user;
      const user = await User.findById(loginUser._id);
      const image = files.image;

      const oldPath = image.filepath;
      const ext = image.originalFilename.split(".")[1];
      const newName = image.newFilename + "." + ext;
      // save profile image in data directory
      const newPath = `${__dirname}/../data/users/${newName}`;

      fs.renameSync(oldPath, newPath);

      // save profile image into db
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

    // update profile image to null
    user.image = null;
    await user.save();

    res.end();

  } catch (error) {
    next(error)
  }
}

exports.edit = async (req, res, next) => {
  try {    
    const loginUser = req.user;
    const user = await User.findById(loginUser._id);
    const bio = req.body.bio;
  
    // update bio
    user.bio = bio;
    await user.save();
  
    res.json(user.bio)

  } catch (error) {
    next(error)
  }
}
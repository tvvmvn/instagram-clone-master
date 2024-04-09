const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Post = require("./Post");
const Following = require("./Following");


/*
  Schema 

  a structure of Model
*/


const userSchema = new Schema({
  email: { type: String, minLength: 5 },
  password: { type: String, minLength: 5 },
  salt: { type: String },
  username: { type: String, minLength: 3, required: true },
  name: { type: String },
  avatar: { type: String, default: "default.png" },
  bio: { type: String }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}); 


/* 
  Virtual field

  You can create virtual fields through joining collections.
  It makes data abundant.
  Virtual fields do not exist on database.
*/


userSchema.virtual("avatarUrl").get(function () {
  return process.env.FILE_URL + "/avatar/" + this.avatar;
})

userSchema.virtual("postCount", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
  count: true
})

userSchema.virtual("followerCount", {
  ref: "Following",
  localField: "_id",
  foreignField: "following",
  count: true
})

userSchema.virtual("followingCount", {
  ref: "Following",
  localField: "_id",
  foreignField: "user",
  count: true
})

userSchema.virtual("isFollowing", {
  ref: "Following",
  localField: "_id",
  foreignField: "following",
  justOne: true
})


/* 
  Operations
  
  Model's behavior to process data about itself.
*/


userSchema.methods.setPassword = function (password) {
  this.salt = crypto
    .randomBytes(16).toString("hex");
  
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 310000, 32, "sha256")
    .toString("hex")
}

userSchema.methods.checkPassword = function (password) {
  const hashedPassword = crypto
    .pbkdf2Sync(password, this.salt, 310000, 32, "sha256")
    .toString("hex")
  
  return this.password === hashedPassword;
}

userSchema.methods.generateJWT = function () {
  const payload = { 
    sub: this._id, 
    username: this.username 
  }
  const secret = process.env.SECRET;

  return jwt.sign(payload, secret);
}


module.exports = mongoose.model("User", userSchema);

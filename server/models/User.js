const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new Schema({
  username: { type: String, minLength: 5, required: true },
  password: { type: String, minLength: 5, required: true },
  salt: { type: String, required: true },
  email: { type: String, minLength: 5, required: true },
  fullName: { type: String },
  avatar: { type: String, default: 'default.png' },
  bio: { type: String }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual field
userSchema.virtual('articleCount', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'author',
  count: true
})

userSchema.virtual('followerCount', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'following',
  count: true
})

userSchema.virtual('followingCount', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'follower',
  count: true
})

userSchema.virtual('isFollowing', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'following',
  justOne: true
})

// Operations
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
  return jwt.sign(
    { sub: this._id, username: this.username }, 
    process.env.SECRET
  );
}

module.exports = mongoose.model('User', userSchema);

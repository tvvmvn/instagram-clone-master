const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new Schema({
  email: { type: String, minLength: 5, required: true },
  password: { type: String, minLength: 5 },
  salt: { type: String },
  username: { type: String, minLength: 3, required: true },
  name: { type: String },
  avatar: { type: String, default: 'default.png' },
  bio: { type: String }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}) 

// Virtual field
userSchema.virtual('avatarUrl').get(function () {
  return process.env.FILE_URL + '/avatar/' + this.avatar
})

userSchema.virtual('postCount', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
  count: true
})

userSchema.virtual('followerCount', {
  ref: 'Following',
  localField: '_id',
  foreignField: 'following',
  count: true
})

userSchema.virtual('followingCount', {
  ref: 'Following',
  localField: '_id',
  foreignField: 'user',
  count: true
})

userSchema.virtual('isFollowing', {
  ref: 'Following',
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
  const access_token = jwt.sign(
    { sub: this._id, username: this.username }, 
    process.env.SECRET
  );

  return access_token;
}

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new Schema({
  username: { type: String, required: true, minLength: 3, maxLength: 100 },
  password: { type: String, minLength: 5 },
  salt: { type: String },
  email: { type: String, required: true, maxLength: 100 },
  fullName: { type: String },
  avatar: { type: String, default: 'default.png' },
  bio: { type: String },
},
{ 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

userSchema.methods.generateJWT = function () {
  return jwt.sign({ username: this.username }, process.env.SECRET);
}

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

userSchema.virtual('isFollowing', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'following',
  justOne: true
})

module.exports = mongoose.model('User', userSchema);

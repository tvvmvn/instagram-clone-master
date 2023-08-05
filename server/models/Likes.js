const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const likesSchema = new Schema({
  user: { type: Schema.ObjectId, required: true },
  post: { type: Schema.ObjectId, required: true }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

module.exports = mongoose.model('Likes', likesSchema)
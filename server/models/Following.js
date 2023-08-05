const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const followingSchema = new Schema({
  user: { type: Schema.ObjectId, required: true },
  following: { type: Schema.ObjectId, required: true }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

module.exports = mongoose.model('Following', followingSchema);




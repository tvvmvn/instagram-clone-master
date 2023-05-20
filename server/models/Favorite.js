const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  user: { type: Schema.ObjectId, required: true },
  article: { type: Schema.ObjectId, required: true }
}, { // options
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

module.exports = mongoose.model('Favorite', favoriteSchema)
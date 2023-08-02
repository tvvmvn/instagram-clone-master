const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const articleSchema = new Schema({
  photos: [{ type: String, required: true }],
  description: { type: String },
  author: { type: Schema.ObjectId, required: true, ref: 'User' },
  favoriteCount: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual field
articleSchema.virtual('displayDate').get(function () {
   return DateTime
    .fromJSDate(this.createdAt)
    .toLocaleString(DateTime.DATE_MED);
})

articleSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'article',
  count: true
})

articleSchema.virtual('isFavorite', {
  ref: 'Favorite',
  localField: '_id', 
  foreignField: 'article',
  justOne: true
})

module.exports = mongoose.model('Article', articleSchema);
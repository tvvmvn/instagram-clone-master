const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const commentSchema = new Schema({
  content: { type: String },
  article: { type: Schema.ObjectId, required: true },
  author: { type: Schema.ObjectId, required: true, ref: 'User' },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual field
commentSchema.virtual('displayDate').get(function () {
  return DateTime
   .fromJSDate(this.createdAt)
   .toLocaleString(DateTime.DATETIME_MED);
})

module.exports = mongoose.model('Comment', commentSchema);
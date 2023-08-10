const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const commentSchema = new Schema({
  content: { type: String },
  post: { type: Schema.ObjectId, required: true },
  user: { type: Schema.ObjectId, required: true, ref: 'User' },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual field
commentSchema.virtual('displayDate').get(function () {
  const displayDate = DateTime
    .fromJSDate(this.createdAt)
    .toLocaleString(DateTime.DATETIME_MED);

  return displayDate;
})

module.exports = mongoose.model('Comment', commentSchema);
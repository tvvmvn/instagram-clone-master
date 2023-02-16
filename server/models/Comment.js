const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const CommentSchema = new Schema({
  content: { type: String },
  article: { type: Schema.ObjectId, required: true },
  author: { type: Schema.ObjectId, required: true, ref: 'User' },
  created: { type: Date, default: Date.now },
})

CommentSchema.virtual('date').get(function () {
  let date = DateTime.fromJSDate(this.created).toLocaleString(DateTime.DATE_MED)

  return date;
})

module.exports = mongoose.model('Comment', CommentSchema);
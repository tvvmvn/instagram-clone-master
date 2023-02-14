const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const slug = require('slug');
const { DateTime } = require('luxon');

const ArticleSchema = new Schema({
  images: [{ type: String, required: true, ref: 'Image' }],
  description: { type: String },
  created: { type: Date, default: Date.now },
  author: { type: Schema.ObjectId, required: true, ref: 'User' },
  favoriteCount: { type: Number, default: 0 },
  slug: { type: String }
})

ArticleSchema.methods.slugify = function (name) {
  this.slug = slug(name, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
}

ArticleSchema.virtual('date').get(function () {
  let date = DateTime.fromJSDate(this.created).toLocaleString(DateTime.DATE_MED);

  return date;
})

module.exports = mongoose.model('Article', ArticleSchema)
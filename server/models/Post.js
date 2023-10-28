const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");
const Comment = require("./Comment");
const Likes = require("./Likes");

const postSchema = new Schema({
  photos: [{ type: String, required: true }],
  caption: { type: String },
  user: { type: Schema.ObjectId, required: true, ref: "User" },
  likesCount: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual field
postSchema.virtual("displayDate").get(function () {
   const displayDate = DateTime
    .fromJSDate(this.createdAt)
    .toLocaleString(DateTime.DATE_MED);

  return displayDate;
})

postSchema.virtual("photoUrls").get(function () {
  const urls = this.photos.map(photoName => {
    return process.env.FILE_URL + "/photos/" + photoName
  })

  return urls;
})

postSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  count: true
})

postSchema.virtual("liked", {
  ref: "Likes",
  localField: "_id", 
  foreignField: "post",
  justOne: true
})

module.exports = mongoose.model("Post", postSchema);
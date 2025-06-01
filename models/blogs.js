const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const blogSchema = new Schema({
  title: { type: String, required: [true, "title is required"] },
  image: { type: String, required: [true, "image is required"] },
  body: String,
  description: String,
});

const blog = mongoose.model("Blog", blogSchema);
module.exports = blog;

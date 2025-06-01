const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const serviceSchema = new Schema({
  title: { type: String, required: [true, "title is required"] },
  body: String,
  image: { type: String, required: [true, "image is required"] },
});

const service = mongoose.model("Service", serviceSchema);
module.exports = service;

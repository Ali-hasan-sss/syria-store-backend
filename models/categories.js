const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const categoriesSchema = new Schema({
  title: { type: String, required: [true, "title is required"] },
});
const categories = mongoose.model("categories", categoriesSchema);
module.exports = categories;

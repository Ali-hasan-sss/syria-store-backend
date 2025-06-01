const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const productSchema = new Schema({
  name: { type: String, required: [true, "the product name is required"] },
  price: { type: Number, required: [true, "price is required"] },
  images: String,
  rate: Number,
  category: { type: String, required: [true, "category is required"] },
});
const product = mongoose.model("product", productSchema);
module.exports = product;

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: [true, "The product name is required"] },
    price: { type: Number, required: [true, "Price is required"] },
    images: [String],
    rate: Number,
    status: { type: Number, default: 0 },
    description: String,
    phone: { type: String, required: [true, "phone number is required"] },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

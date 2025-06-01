const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name must not exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    phone_num: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
      minlength: [10, "Please enter a valid phone number"],
      maxlength: [10, "Please enter a valid phone number"],
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"], // allowed roles
      default: "USER",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const User = mongoose.model("User", usersSchema);
module.exports = User;

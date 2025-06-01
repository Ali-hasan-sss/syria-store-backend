const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

// -------------------
// Register New User
// -------------------
router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 }),
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone_num")
      .matches(/^09\d{8}$/)
      .withMessage("Phone number must start with 09 and be 10 digits long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // نرجع أول خطأ للمستخدم
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        field: errors.array()[0].param,
      });
    }

    try {
      const { name, email, password, phone_num } = req.body;

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken.",
          field: "email",
        });
      }

      const existingPhone = await User.findOne({ phone_num });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already taken.",
          field: "phone_num",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        phone_num,
        password: hashedPassword,
      });

      await newUser.save();

      const payload = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone_num: newUser.phone_num,
        isActive: newUser.isActive,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(201).json({
        success: true,
        message: "User registered and logged in successfully.",
        data: {
          token,
          user: payload,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "An error occurred during registration.",
        error: err.message,
      });
    }
  }
);

// -------------------
// User Login
// -------------------
router.post(
  "/login",
  [
    body("identifier").notEmpty().withMessage("Identifier is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        field: errors.array()[0].param,
      });
    }

    try {
      const { identifier, password } = req.body;

      let user;
      if (/^\S+@\S+\.\S+$/.test(identifier)) {
        user = await User.findOne({ email: identifier });
      } else if (/^09\d{8}$/.test(identifier)) {
        user = await User.findOne({ phone_num: identifier });
      } else {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email or phone number.",
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid password.",
        });
      }

      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone_num: user.phone_num,
        isActive: user.isActive,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({
        success: true,
        message: "Login successful.",
        data: {
          token,
          user: payload,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "An error occurred during login.",
        error: err.message,
      });
    }
  }
);

module.exports = router;

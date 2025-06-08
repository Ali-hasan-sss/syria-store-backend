const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { isAdmin, verifyToken } = require("../middleware/auth");

const fs = require("fs");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  verifyToken,
  isAdmin,
  upload.single("file"),
  async (req, res) => {
    try {
      const filePath = req.file?.path;

      if (!filePath)
        return res.status(400).json({ message: "لم يتم رفع الملف" });

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "syria-store",
      });

      fs.unlinkSync(filePath);

      return res.json({
        imageUrl: result.secure_url,
        publicId: result.public_id,
        originalName: req.file.originalname,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ err });
    }
  }
);

module.exports = router;

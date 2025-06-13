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
  upload.array("file", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "لم يتم رفع أي ملفات" });
      }

      const uploadedFiles = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "syria-store",
        });

        uploadedFiles.push({
          imageUrl: result.secure_url,
          publicId: result.public_id,
          originalName: file.originalname,
        });

        fs.unlinkSync(file.path);
      }

      return res.json(uploadedFiles);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "فشل في رفع الملفات", err });
    }
  }
);

module.exports = router;

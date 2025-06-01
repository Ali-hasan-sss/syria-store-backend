const express = require("express");
const blogs = require("../models/blogs");

const router = express.Router();

// إضافة blog
router.post("/blogs", async (req, res) => {
  const { title, image, body, description } = req.body;
  const newBlog = new blogs({ title, image, body, description });

  try {
    await newBlog.save();
    res.json({
      message: "add blog success",
      data: newBlog,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// جلب جميع الـ blogs
router.get("/blogs", async (req, res) => {
  try {
    const Blogs = await blogs.find();
    res.json(Blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// عرض المدونات باستخدام EJS
router.get("/viewblogs", async (req, res) => {
  try {
    const Blogs = await blogs.find();
    res.render("blogs.ejs", { allBlogs: Blogs });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// جلب blog باستخدام ID
router.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await blogs.findById(req.params.id);
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/blogs/:id", async (req, res) => {
  const { title, body, image, description } = req.body;
  try {
    const newBlog = await blogs.findByIdAndUpdate(req.params.id, {
      title,
      image,
      body,
      description,
    });
    res.json({ message: "service updated successfuly", data: newBlog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف blog
router.delete("/blogs/:id", async (req, res) => {
  try {
    await blogs.findByIdAndDelete(req.params.id);
    res.send("Deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

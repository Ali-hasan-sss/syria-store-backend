const express = require("express");
const blogs = require("../models/blogs");
const { isAdmin, verifyToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *               - body
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *               body:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog created successfully
 *       500:
 *         description: Server error
 */
router.post("/blogs", verifyToken, isAdmin, async (req, res) => {
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

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of all blogs
 *       500:
 *         description: Server error
 */
router.get("/blogs", async (req, res) => {
  try {
    const Blogs = await blogs.find();
    res.json(Blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /viewblogs:
 *   get:
 *     summary: Render all blogs using EJS
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Rendered blogs page
 *       500:
 *         description: Server error
 */
router.get("/viewblogs", async (req, res) => {
  try {
    const Blogs = await blogs.find();
    res.render("blogs.ejs", { allBlogs: Blogs });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a single blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Blog ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog data
 *       500:
 *         description: Server error
 */
router.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await blogs.findById(req.params.id);
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update a blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Blog ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       500:
 *         description: Server error
 */
router.put("/blogs/:id", verifyToken, isAdmin, async (req, res) => {
  const { title, body, image, description } = req.body;
  try {
    const newBlog = await blogs.findByIdAndUpdate(
      req.params.id,
      { title, image, body, description },
      { new: true }
    );
    res.json({ message: "service updated successfuly", data: newBlog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Blog ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       500:
 *         description: Server error
 */
router.delete("/blogs/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await blogs.findByIdAndDelete(req.params.id);
    res.send("Deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

const express = require("express");
const services = require("../models/services");
const { isAdmin, verifyToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: API endpoints for managing services
 */

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Add a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Service Title"
 *               body:
 *                 type: string
 *                 example: "Service description goes here."
 *               image:
 *                 type: string
 *                 example: "http://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Service added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "add service success"
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
router.post("/services", verifyToken, isAdmin, async (req, res) => {
  const { title, body, image } = req.body;
  const newService = new services({ title, body, image });

  try {
    await newService.save();
    res.json({
      message: "add service success",
      data: newService,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
router.get("/services", async (req, res) => {
  try {
    const allServices = await services.find();
    res.json(allServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Service ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
router.get("/services/:id", async (req, res) => {
  try {
    const service = await services.findById(req.params.id);
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Update a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Service ID
 *         required: true
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
 *             example:
 *               title: "Updated service title"
 *               body: "Updated description"
 *               image: "http://example.com/updated-image.jpg"
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "service updated successfuly"
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
router.put("/services/:id", verifyToken, isAdmin, async (req, res) => {
  const { title, body, image } = req.body;
  try {
    const newService = await services.findByIdAndUpdate(req.params.id, {
      title,
      body,
      image,
    });
    res.json({ message: "service updated successfuly", data: newService });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Service ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "services delete successfully"
 *       500:
 *         description: Server error
 */
router.delete("/services/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await services.findByIdAndDelete(req.params.id);
    res.send("services delete successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

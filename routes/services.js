const express = require("express");
const services = require("../models/services");

const router = express.Router();

//add service
router.post("/services", async (req, res) => {
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

//get all services
router.get("/services", async (req, res) => {
  try {
    const allServices = await services.find();
    res.json(allServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get service by id
router.get("/services/:id", async (req, res) => {
  try {
    const service = await services.findById(req.params.id);
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//update servise
router.put("/services/:id", async (req, res) => {
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

//delete service
router.delete("/services/:id", async (req, res) => {
  try {
    await services.findByIdAndDelete(req.params.id);
    res.send("services delete successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

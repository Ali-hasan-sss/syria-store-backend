const express = require("express");
const users = require("../models/users");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/users", verifyToken, isAdmin, async (req, res) => {
  const { name, phone_num, email, password, role } = req.body;
  const newUser = new users({ name, phone_num, email, password, role });

  try {
    await newUser.save();
    res.json({
      message: "add user success",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const allUsers = await users.find();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await users.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/users/:id", verifyToken, isAdmin, async (req, res) => {
  const { name, phone_num, password, role, email, isActive } = req.body;
  try {
    const newUser = await users.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone_num,
        isActive,
        role,
        password,
      },
      { new: true }
    );

    res.json({ message: "user updated successfuly", data: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await users.findByIdAndDelete(req.params.id);
    res.send("user delete successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

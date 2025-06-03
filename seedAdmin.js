const mongoose = require("mongoose");
const User = require("./models/users");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL); // عدل رابط الداتا بيس

    const existingAdmin = await User.findOne({ role: "ADMIN" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("12341234", 10); // استبدل بكلمة المرور اللي تريدها

    const adminUser = new User({
      name: "ALI",
      phone_num: "0994488859",
      username: "admin",
      email: "admin@admin.com",
      password: hashedPassword,
      role: "ADMIN",
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();

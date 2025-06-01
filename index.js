const express = require("express");
const mongoose = require("mongoose");
const blogsRoute = require("./routes/blogs");
const servicesRoute = require("./routes/services");
const authRoute = require("./routes/auth");
// const mongoSanitize = require("express-mongo-sanitize");   *******problem******
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const port = process.env.PORT;
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://syria-store-git-main-ali-hasan-sss-projects.vercel.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ تحديد معدل الطلبات: 30 طلب لكل دقيقة
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 دقيقة
  max: 30, // الحد الأقصى 30 طلب
  message: "Too many requests",
});

// ✅ تطبيق جميع الـ middlewares
// app.use(mongoSanitize());
app.use(helmet());
app.use(express.json());
app.use(globalLimiter); // ✅ تطبيق الحد على كل المسارات

// توجيه كل الروتات تحت مسار /api
app.use("/api", blogsRoute);
app.use("/api", servicesRoute);
app.use("/api", authRoute);

// اتصال بقاعدة البيانات
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected successfully");
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

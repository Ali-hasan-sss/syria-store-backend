// middleware/auth.js

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Admins only" });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};

const express = require("express");
const product = require("../models/products");
const { isAdmin, verifyToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
router.get("/products", verifyToken, async (req, res) => {
  const { minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (req.user.role !== "ADMIN") {
    filter.status = 1;
  }
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;

  const skip = (pageNumber - 1) * pageSize;

  try {
    const [products, total] = await Promise.all([
      product.find(filter).skip(skip).limit(pageSize),
      product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /products/latest:
 *   get:
 *     summary: Get latest 10 added products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of latest 10 products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/products/latest", async (req, res) => {
  try {
    const filter = {};
    if (!req.user || req.user.role !== "ADMIN") {
      filter.status = 1;
    }

    const latestProducts = await product
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: latestProducts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products/top-rated:
 *   get:
 *     summary: Get top rated products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of top rated products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/products/top-rated", async (req, res) => {
  try {
    const filter = { rate: { $gt: 0 } };
    if (!req.user || req.user.role !== "ADMIN") {
      filter.status = 1;
    }

    const topRatedProducts = await product
      .find(filter)
      .sort({ rate: -1 })
      .limit(10);

    res.json({ success: true, data: topRatedProducts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: The requested product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/products/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const productQuery = product.findById(id).populate("category");
    const foundProduct = await productQuery;

    if (!foundProduct) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    // إذا لم يكن أدمن، تأكد أن حالة المنتج = 1
    if (req.user.role !== "ADMIN" && foundProduct.status !== 1) {
      return res.status(403).json({ error: "لا تملك صلاحية عرض هذا المنتج" });
    }

    res.json({ success: true, data: foundProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /products/category/{categoryId}:
 *   get:
 *     summary: Get products by category ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: List of products in the given category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
router.get("/products/category/:categoryId", verifyToken, async (req, res) => {
  const { categoryId } = req.params;
  const { minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  const filter = {
    category_id: categoryId,
  };

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (req.user.role !== "ADMIN") {
    filter.status = 1;
  }

  try {
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    const total = await product.countDocuments(filter);
    const products = await product
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("category_id");

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//add product from admin
router.post("/products", verifyToken, isAdmin, async (req, res) => {
  const { name, price, description, category_id, images, rate, phone } =
    req.body;
  const newProduct = new product({
    name,
    price,
    phone,
    images,
    description,
    rate,
    category_id,
  });
  try {
    await newProduct.save();
    res.json({ success: true, data: newProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//update product from admin only
router.put("/products/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category_id, images, rate, phone } =
    req.body;
  try {
    const updatedProduct = await product.findByIdAndUpdate(
      id,
      { name, price, description, category_id, images, rate, phone },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/**
 * @swagger
 * /products/{id}/status:
 *   patch:
 *     summary: Change product status (Admins only)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *                 example: 1
 *                 description: 0=معلق, 1=معروض, 2=مباع
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Access Denied
 *       404:
 *         description: Product not found
 */
router.patch("/products/:id/status", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (![0, 1, 2].includes(status)) {
    return res.status(400).json({ message: "حالة المنتج غير صالحة" });
  }

  try {
    const updatedProduct = await product.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    res.json({
      success: true,
      message: "تم تحديث حالة المنتج",
      data: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ ما", error: err.message });
  }
});

//update product from all user
router.patch("/products/:id/rate", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;
  const userId = req.user.id;

  try {
    const productDoc = await product.findById(id);
    if (!productDoc) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    // هل المستخدم قيّم سابقاً؟
    const existingRating = productDoc.ratings.find(
      (r) => r.userId.toString() === userId
    );

    if (existingRating) {
      // تحديث تقييمه السابق
      existingRating.rate = rate;
    } else {
      // إضافة تقييم جديد
      productDoc.ratings.push({ userId, rate });
    }

    // حساب المتوسط
    const total = productDoc.ratings.reduce((sum, r) => sum + r.rate, 0);
    const avg = total / productDoc.ratings.length;
    productDoc.averageRating = avg;

    // حفظ المنتج
    await productDoc.save();

    res.json({ success: true, data: productDoc });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//delete product from admin
router.delete("/products/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }
    res.json({ success: true, message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// تعريف الـ Schema الخاص بالمستخدمين
const usersSchema = new Schema(
  {
    name: {
      type: String, // نوع البيانات
      trim: true, // إزالة المسافات الزائدة من البداية والنهاية
      required: [true, "الاسم مطلوب"], // الحقل إجباري، والرسالة عند الخطأ
      minlength: [3, "الاسم يجب أن لا يقل عن 3 أحرف"], // الحد الأدنى للطول
      maxlength: [50, "الاسم لا يجب أن يزيد عن 50 حرفاً"], // الحد الأقصى للطول
    },

    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      unique: true, // يمنع تكرار نفس الإيميل
      match: [/^\S+@\S+\.\S+$/, "يرجى إدخال بريد إلكتروني صحيح"], // regex للتحقق من صيغة الإيميل
    },

    password: {
      type: String,
      required: [true, "كلمة المرور مطلوبة"],
      minlength: [6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"],
    },
  },
  { timestamps: true }
);

// إنشاء الموديل وربطه بالـ collection في قاعدة البيانات
const User = mongoose.model("User", usersSchema);

// تصدير الموديل لاستخدامه في ملفات أخرى

//authorize   user
// مثال داخل route تعديل منتج
router.put("/products/:id", verifyToken, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found." });

  // فقط صاحب المنتج أو الأدمن يمكنه التعديل
  if (req.user.role !== "ADMIN" && product.owner.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You can only edit your own products." });
  }

  // أكمل التعديل...
});

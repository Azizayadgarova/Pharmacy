import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  try {
    const existingAdmins = await Admin.find();

    // Agar bazada allaqachon admin bo‘lsa, yangi yaratilmaydi
    if (existingAdmins.length > 0) {
      return res.status(403).json({
        success: false,
        message: "Admin allaqachon yaratilgan. Yangi admin qo‘shib bo‘lmaydi."
      });
    }

    const { username, password } = req.body;
    const admin = await Admin.create({ username, password });

    res.status(201).json({
      success: true,
      message: "Admin muvaffaqiyatli yaratildi.",
      admin: { username: admin.username }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Login (token olish)
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Noto‘g‘ri login yoki parol" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Noto‘g‘ri login yoki parol" });

    const secret = process.env.JWT_SECRET || "defaultsecret"; // fallback
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      secret,
      { expiresIn: "7d" }
    );


    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ADMIN MA'LUMOTLARINI YANGILASH

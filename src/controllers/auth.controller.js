import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  try {
    // 🔒 BAZADA ADMIN BOR-YO‘QLIGINI TEKSHIRISH
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({ message: "Admin allaqachon yaratilgan" });
    }

    const { username, password } = req.body;

    const admin = await Admin.create({ username, password });
    res.status(201).json({ success: true, admin: { username: admin.username } });
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

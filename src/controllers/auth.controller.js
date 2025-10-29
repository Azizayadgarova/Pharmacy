import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ message: "Admin allaqachon mavjud" });

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
export const updateAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // parolni hash qilish
    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.updateOne({}, { username, password: hashedPassword });

    res.json({ success: true, message: "Admin yangilandi" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


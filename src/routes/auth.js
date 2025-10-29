import express from "express";
import { registerAdmin, loginAdmin, updateAdmin } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Faqat birinchi admin yaratish uchun
router.post("/register", registerAdmin);

// Login uchun
router.post("/login", loginAdmin);

// Admin ma'lumotlarini yangilash
router.put("/update", protect, updateAdmin);

export default router;

import express from "express";
import StockHistory from "../models/StockHistory.js";
import {
  createMedicine,
  listMedicines,
  getMedicine,
  updateMedicine,
  deleteMedicine,
  receiveStock,
  sellStock,
  getExpiringSoon,
  getExpiredMedicines,
} from "../controllers/medicine.controller.js";
import { protect } from "../middlewares/authMiddleware.js"; // 🛡 qo‘shish kerak

const router = express.Router();

// ➕ Yangi dori qo‘shish (faqat admin)
router.post("/", protect, createMedicine);

// 📋 Barcha dorilar ro'yxati (ochiq yoki xohlasangiz protect bilan)
router.get("/", listMedicines);

// 📌 Muddati yaqin tugaydigan dorilar
router.get("/expiring/soon", protect, getExpiringSoon);

// ⛔ Muddati o'tgan dorilar
router.get("/expired", protect, getExpiredMedicines);

// 📦 Omborga dori qo'shish (kirim)
router.post("/:id/receive", protect, receiveStock);

// 💊 Dori sotish (chiqim)
router.post("/:id/sell", protect, sellStock);

// 📜 Dorining kirim/chiqim tarixi
router.get("/:id/history", protect, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const items = await StockHistory.find({ medicine: req.params.id })
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json({ success: true, count: items.length, items });
  } catch (e) {
    console.error("History error:", e);
    res.status(500).json({ message: e.message });
  }
});

// 🔍 Bitta dori ma'lumotini olish
router.get("/:id", protect, getMedicine);

// ✏️ Dori ma'lumotlarini yangilash
router.put("/:id", protect, updateMedicine);

// 🗑️ Dori o'chirish
router.delete("/:id", protect, deleteMedicine);

export default router;

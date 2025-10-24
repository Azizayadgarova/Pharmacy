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

const router = express.Router();

/**
 * ROUTE TARTIBI MUHIM:
 * 1) Statik/konkret yo'llar ("/", "/expiring/soon", "/expired", "/:id/history", "/:id/receive", "/:id/sell")
 * 2) Paramli yo'llar ("/:id", "/:id" uchun PUT/DELETE)
 */

// ➕ Yangi dori qo'shish
router.post("/", createMedicine);

// 📋 Barcha dorilar ro'yxati
router.get("/", listMedicines);

// 📌 Muddati yaqin tugaydigan dorilar (30 kun ichida)
router.get("/expiring/soon", getExpiringSoon);

// ⛔ Muddati o'tgan dorilar
router.get("/expired", getExpiredMedicines);

// 📦 Omborga dori qo'shish (kirim)
router.post("/:id/receive", receiveStock);

// 💊 Dori sotish (chiqim)
router.post("/:id/sell", sellStock);

// 📜 Dorining kirim/chiqim tarixi
router.get("/:id/history", async (req, res) => {
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
router.get("/:id", getMedicine);

// ✏️ Dori ma'lumotlarini yangilash
router.put("/:id", updateMedicine);

// 🗑️ Dori o'chirish
router.delete("/:id", deleteMedicine);

export default router;

import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

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

import StockHistory from "../models/StockHistory.js";

const router = express.Router();

// PUBLIC
router.get("/", listMedicines);

// PUBLIC — ID bilan olish
router.get("/:id", getMedicine);

// TOKEN REQUIRED
router.post("/", protect, createMedicine);
router.get("/expiring/soon", protect, getExpiringSoon);
router.get("/expired", protect, getExpiredMedicines);

router.post("/:id/receive", protect, receiveStock);
router.post("/:id/sell", protect, sellStock);

// HISTORY — TOKEN REQUIRED
router.get("/:id/history",  async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const items = await StockHistory.find({ medicine: req.params.id })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, count: items.length, items });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/:id", protect, updateMedicine);
router.delete("/:id", protect, deleteMedicine);

export default router;

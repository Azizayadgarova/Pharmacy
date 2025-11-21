import express from "express";
import StockHistory from "../models/StockHistory.js";
import Medicine from "../models/Medicine.js";
import { units, categories } from "../utils/constants.js";

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
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Medicines
 *   description: Dori ma'lumotlarini boshqarish API
 */

/**
 * @swagger
 * /medicines:
 *   get:
 *     summary: Barcha dorilar ro‘yxatini olish
 *     tags: [Medicines]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: ["Vitaminlar", "Og‘riq qoldiruvchilar", "Shamollash va Gripp dorilari", "Ona va bola uchun", "Tibbiy texnika", "Go‘zallik mahsulotlari"]
 *         description: Kategoriyaga ko‘ra filtr
 *     responses:
 *       200:
 *         description: Dorilar ro‘yxati
 */
router.get("/", listMedicines);

/**
 * @swagger
 * /medicines:
 *   post:
 *     summary: Yangi dori qo‘shish
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicineInput'
 *     responses:
 *       201:
 *         description: Dori yaratildi
 */
router.post("/", protect, createMedicine);

/**
 * @swagger
 * /medicines/expiring/soon:
 *   get:
 *     summary: Muddati yaqin tugaydigan dorilarni olish
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dorilar ro‘yxati
 */
router.get("/expiring/soon", protect, getExpiringSoon);

/**
 * @swagger
 * /medicines/expired:
 *   get:
 *     summary: Muddati o'tgan dorilar
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dorilar ro‘yxati
 */
router.get("/expired", protect, getExpiredMedicines);

/**
 * @swagger
 * /medicines/{id}/receive:
 *   post:
 *     summary: Omborga dori kirimini qo‘shish
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/receive", protect, receiveStock);

/**
 * @swagger
 * /medicines/{id}/sell:
 *   post:
 *     summary: Dorini sotish (chiqim)
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/sell", protect, sellStock);

/**
 * @swagger
 * /medicines/{id}/history:
 *   get:
 *     summary: Dorining kirim-chiqim tarixi
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 */
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

/**
 * @swagger
 * /medicines/{id}:
 *   get:
 *     summary: Bitta dori ma’lumotini olish
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", protect, getMedicine);

/**
 * @swagger
 * /medicines/{id}:
 *   put:
 *     summary: Dorini yangilash
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id", protect, updateMedicine);

/**
 * @swagger
 * /medicines/{id}:
 *   delete:
 *     summary: Dorini o‘chirish
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", protect, deleteMedicine);

export default router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Medicine:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         company: { type: string }
 *         costPrice: { type: number }
 *         sellPrice: { type: number }
 *         unit: { type: string }
 *         expiryAt: { type: string, format: date }
 *         manufacturedAt: { type: string, format: date }
 *         totalReceived: { type: number }
 *         totalSold: { type: number }
 *         img: { type: string }
 *         notes: { type: string }
 *         category:
 *           type: string
 *           enum: ["Vitaminlar", "Og‘riq qoldiruvchilar", "Shamollash va Gripp dorilari", "Ona va bola uchun", "Tibbiy texnika", "Go‘zallik mahsulotlari"]
 *     MedicineInput:
 *       type: object
 *       required: [name, costPrice, sellPrice, category]
 *       properties:
 *         name: { type: string }
 *         company: { type: string }
 *         costPrice: { type: number }
 *         sellPrice: { type: number }
 *         expiryAt: { type: string, format: date }
 *         manufacturedAt: { type: string, format: date }
 *         totalReceived: { type: number }
 *         totalSold: { type: number }
 *         unit: { type: string }
 *         img: { type: string }
 *         notes: { type: string }
 *         category:
 *           type: string
 *           enum: ["Vitaminlar", "Og‘riq qoldiruvchilar", "Shamollash va Gripp dorilari", "Ona va bola uchun", "Tibbiy texnika", "Go‘zallik mahsulotlari"]
 */

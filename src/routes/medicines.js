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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dori ID’si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Kirim muvaffaqiyatli qo‘shildi
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Chiqim muvaffaqiyatli bajarildi
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: "Qancha tarix qaytarilsin (default: 50)"
 *     responses:
 *       200:
 *         description: Tarix ma’lumotlari
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dori topildi
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicineInput'
 *     responses:
 *       200:
 *         description: Dorining ma’lumotlari yangilandi
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dori o‘chirildi
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
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         company:
 *           type: string
 *         costPrice:
 *           type: number
 *         sellPrice:
 *           type: number
 *         unit:
 *           type: string
 *         expiryAt:
 *           type: string
 *           format: date
 *         manufacturedAt:
 *           type: string
 *           format: date
 *         totalReceived:
 *           type: number
 *         totalSold:
 *           type: number
 *         img:
 *           type: string
 *         notes:
 *           type: string
 *     MedicineInput:
 *       type: object
 *       required:
 *         - name
 *         - costPrice
 *         - sellPrice
 *       properties:
 *         name:
 *           type: string
 *         company:
 *           type: string
 *         costPrice:
 *           type: number
 *         sellPrice:
 *           type: number
 *         expiryAt:
 *           type: string
 *           format: date
 *         manufacturedAt:
 *           type: string
 *           format: date
 *         totalReceived:
 *           type: number
 *         totalSold:
 *           type: number
 *         unit:
 *           type: string
 *         img:
 *           type: string
 *         notes:
 *           type: string
 */

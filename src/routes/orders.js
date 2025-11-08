import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   get:   
 *     summary: Barcha buyurtmalar ro‘yxatini olish
 */
router.get("/", protect, getOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Yangi buyurtma yaratish
 */
router.post("/", protect, createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Bitta buyurtmani olish
 */
router.get("/:id", protect, getOrderById);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Buyurtma holatini yangilash
 */
router.put("/:id", protect, updateOrderStatus);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Buyurtmani o‘chirish
 */
router.delete("/:id", protect, deleteOrder);

export default router;

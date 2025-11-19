import express from "express";
import { protect } from "../middlewares/auth.js";
import { createAd, getAds, deleteAd } from "../controllers/advertisement.controller.js";

const router = express.Router();

// GET — reklamalar ro‘yxati
router.get("/", getAds);

// POST — reklama qo‘shish (faqat admin)
router.post("/", protect, createAd);

// DELETE — reklama o‘chirish
router.delete("/:id", protect, deleteAd);
console.log("aziza");

export default router;

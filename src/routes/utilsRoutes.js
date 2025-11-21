import express from "express";
import { units, categories } from "../utils/constants.js";

const router = express.Router();

router.get("/units", (req, res) => {
  res.json({ success: true, units });
});

router.get("/categories", (req, res) => {
  res.json({ success: true, categories });
});

export default router;

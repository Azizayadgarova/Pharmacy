import mongoose from "mongoose";
import { units, categories } from "../utils/constants.js";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  originCountry: { type: String, trim: true }, // Ishlab chiqarilgan joyi
  company: { type: String, trim: true },

  manufacturedAt: { type: Date, required: true },
  expiryAt: { type: Date },

  costPrice: { type: Number, required: true, min: 0 },
  sellPrice: { type: Number, required: true, min: 0 },

  totalReceived: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },

  unit: { type: String, enum: units, required: true },
  batchNumber: { type: String, trim: true },
  barcode: { type: String, trim: true },

  notes: { type: String, trim: true },
  img: { type: String, default: "" },

  category: { type: String, enum: categories, required: true },

  // ✅ Yangi maydonlar
  description: { type: String, trim: true },       // Batafsil tavsif
  usage: { type: String, trim: true },             // Qo‘llanishi
  ingredients: { type: String, trim: true },       // Tarkibi
  sideEffects: { type: String, trim: true },       // Nojo‘ya ta’sirlari

}, { timestamps: true });

// Qoldiqni hisoblash
medicineSchema.virtual("currentStock").get(function () {
  return this.totalReceived - this.totalSold;
});

export default mongoose.model("Medicine", medicineSchema);

import mongoose from "mongoose";
import { units, categories } from "../utils/constants.js";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  // ✅ YANGI MAYDON
  originCountry: {
    type: String,
    required: true,
    trim: true
  },

  company: { type: String, trim: true },

  manufacturedAt: { type: Date, required: true },
  expiryAt: { type: Date },

  costPrice: { type: Number, required: true, min: 0 },
  sellPrice: { type: Number, required: true, min: 0 },

  totalReceived: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },

  unit: {
    type: String,
    enum: units,
    required: true
  },

  batchNumber: { type: String, trim: true },
  barcode: { type: String, trim: true },

  notes: { type: String, trim: true },
  img: { type: String, default: "" },

  category: {
    type: String,
    enum: categories,
    required: true
  }

}, { timestamps: true });

// ✅ Qoldiqni hisoblash
medicineSchema.virtual("currentStock").get(function () {
  return this.totalReceived - this.totalSold;
});

export default mongoose.model("Medicine", medicineSchema);

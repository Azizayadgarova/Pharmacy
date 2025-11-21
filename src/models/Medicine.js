import mongoose from "mongoose";
import { units, categories } from "../utils/constants.js"; // Faqat import

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  manufacturedAt: { type: Date, required: true },
  expiryAt: { type: Date },
  costPrice: { type: Number, required: true, min: 0 },
  sellPrice: { type: Number, required: true, min: 0 },
  totalReceived: { type: Number, default: 0, min: 0 },
  totalSold: { type: Number, default: 0, min: 0 },

  unit: {
    type: String,
    enum: units,
    required: true
  },

  batchNumber: { type: String, trim: true },
  barcode: { type: String, trim: true },
  notes: { type: String, trim: true },
  img: { type: String, trim: true, default: "" },

  category: {
    type: String,
    enum: categories,
    required: true
  }
}, { timestamps: true });

medicineSchema.virtual("currentStock").get(function () {
  return (this.totalReceived ?? 0) - (this.totalSold ?? 0);
});

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;

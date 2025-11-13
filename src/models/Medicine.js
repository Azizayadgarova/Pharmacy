import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    manufacturedAt: { type: Date, required: true },
    expiryAt: { type: Date, required: true },
    costPrice: { type: Number, required: true, min: 0 },
    sellPrice: { type: Number, required: true, min: 0 },
    totalReceived: { type: Number, default: 0, min: 0 },
    totalSold: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: "piece" },
    batchNumber: { type: String, trim: true },
    barcode: { type: String, trim: true },
    notes: { type: String, trim: true },
    img: { type: String, trim: true },

    // 🆕 Qo‘shilgan maydon:
    soldCount: { type: Number, default: 0, min: 0 }, // nechta marta sotilgan

  },
  { timestamps: true }
);

export default mongoose.model("Medicine", medicineSchema);

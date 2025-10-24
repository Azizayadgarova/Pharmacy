import mongoose from "mongoose";

const stockHistorySchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
  type: { type: String, enum: ["receive", "sell"], required: true }, // kirim/chiqim
  qty: { type: Number, required: true, min: 1 },
  beforeStock: { type: Number, required: true },
  afterStock: { type: Number, required: true },
  unitCost: { type: Number },   // tannarx (sell uchun ham saqlab qo'yish mumkin)
  unitPrice: { type: Number },  // sotilish narxi
  note: { type: String, trim: true }
}, { timestamps: true });

stockHistorySchema.index({ medicine: 1, createdAt: -1 });

export default mongoose.model("StockHistory", stockHistorySchema);

import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },          // Dorining nomi
    company: { type: String, trim: true },                       // Ishlab chiqaruvchi firma
    manufacturedAt: { type: Date, required: true },              // Ishlab chiqarilgan sana
    expiryAt: { type: Date },                                    // Yaroqlilik muddati
    costPrice: { type: Number, required: true, min: 0 },         // Xarid narxi
    sellPrice: { type: Number, required: true, min: 0 },         // Sotish narxi
    totalReceived: { type: Number, default: 0, min: 0 },         // Olib kelingan miqdor
    totalSold: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator(v) { return v <= this.totalReceived; },       // Sotilgan miqdor kelgandan oshmasin
        message: "Sotilgan miqdor kelgandan ko‘p bo‘la olmaydi"
      }
    },
    unit: { type: String, default: "piece" },                    // O'lchov birligi (tablet, kapsula va hokazo)
    batchNumber: { type: String, trim: true },                   // Partiya raqami
    barcode: { type: String, trim: true },                       // Shtrix-kod
    notes: { type: String, trim: true },                         // Qo'shimcha izoh
    img: {                                                       // Rasm (link)
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,                                           // createdAt va updatedAt maydonlari
    toJSON: { virtuals: true },                                 // virtual maydonlar JSON-da chiqadi
    toObject: { virtuals: true },                               // virtual maydonlar obj sifatida chiqadi
  }
);

// 🔍 Qidiruv indeksi (name va company bo‘yicha text search)
medicineSchema.index({ name: "text", company: "text" });

// 🔢 Virtual maydonlar
medicineSchema.virtual("currentStock").get(function () {
  return (this.totalReceived ?? 0) - (this.totalSold ?? 0);
});
medicineSchema.virtual("profitPerUnit").get(function () {
  return (this.sellPrice ?? 0) - (this.costPrice ?? 0);
});
medicineSchema.virtual("inventoryValue").get(function () {
  return this.currentStock * (this.costPrice ?? 0);
});
medicineSchema.virtual("totalRevenue").get(function () {
  return (this.totalSold ?? 0) * (this.sellPrice ?? 0);
});
medicineSchema.virtual("totalProfit").get(function () {
  return (this.totalSold ?? 0) * ((this.sellPrice ?? 0) - (this.costPrice ?? 0));
});

export default mongoose.model("Medicine", medicineSchema);

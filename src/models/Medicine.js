import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },          // nomi
    company: { type: String, trim: true },                       // firma
    manufacturedAt: { type: Date, required: true },              // ishlab chiqarilgan sanasi
    expiryAt: { type: Date },                                    // yaroqlilik muddati (ixtiyoriy)
    costPrice: { type: Number, required: true, min: 0 },         // o'z narxi
    sellPrice: { type: Number, required: true, min: 0 },         // sotilish narxi
    totalReceived: { type: Number, default: 0, min: 0 },         // nechta olib kelingani
    totalSold: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator(v) { return v <= this.totalReceived; },
        message: "Sotilgan miqdor kelgandan ko‘p bo‘la olmaydi"
      }
    },
    unit: { type: String, default: "piece" },                    // o'lchov birligi
    batchNumber: { type: String, trim: true },                   // partiya
    barcode: { type: String, trim: true },                       // shtrix-kod
    notes: { type: String, trim: true },                         // izoh

    // 🖼️ Dorining rasmi (link ko‘rinishida)
    img: {
      type: String,
      trim: true,
      default: "",                                               // agar rasm bo‘lmasa — bo‘sh
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔍 Qidiruv indeksi
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

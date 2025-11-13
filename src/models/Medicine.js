const units = [
  "Tabletka",
  "Kapsula",
  "Sirup",
  "In’eksiya",
  "Krem/Malham",
  "Nazal spreyi",
  "Ko‘z tomchilari",
  "Antibiotiklar",
  "Analgetiklar",
  "Antiviral",
  "Antifungal",
  "Vitamin va minerallar",
  "Antihistaminlar",
  "Kardio dorilar",
  "Gastro dorilar",
  "OTC",
  "Retsept bo‘yicha"
];

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    manufacturedAt: { type: Date, required: true },
    expiryAt: { type: Date },
    costPrice: { type: Number, required: true, min: 0 },
    sellPrice: { type: Number, required: true, min: 0 },
    totalReceived: { type: Number, default: 0, min: 0 },
    totalSold: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator(v) { return v <= this.totalReceived; },
        message: "Sotilgan miqdor kelgandan ko‘p bo‘la olmaydi"
      }
    },
    unit: { type: String, enum: units, required: true, default: "Tabletka" },
    batchNumber: { type: String, trim: true },
    barcode: { type: String, trim: true },
    notes: { type: String, trim: true },
    img: { type: String, trim: true, default: "" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

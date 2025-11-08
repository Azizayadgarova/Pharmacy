import mongoose from "mongoose";

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
    unit: { type: String, default: "piece" },                    
    batchNumber: { type: String, trim: true },                   
    barcode: { type: String, trim: true },                       
    notes: { type: String, trim: true },                         

    
    img: {
      type: String,
      trim: true,
      default: "",                                               
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

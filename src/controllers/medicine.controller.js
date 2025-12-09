import Medicine from "../models/Medicine.js";
import StockHistory from "../models/StockHistory.js";

// CREATE
export const createMedicine = async (req, res) => {
  try {
    const requiredFields = [
      "name",
      "originCountry",
      "costPrice",
      "sellPrice",
      "unit",
      "category",
      "manufacturedAt"
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Majburiy maydon yetishmayapti: ${field}`
        });
      }
    }

    const medicine = await Medicine.create(req.body);

    res.status(201).json({
      success: true,
      message: "Dori muvaffaqiyatli qo‘shildi",
      medicine
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LIST
export const listMedicines = async (req, res) => {
  try {
    const { q, company, inStock, expiresBefore, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (q) filter.$text = { $search: q };
    if (company) filter.company = company;
    if (inStock === "true")
      filter.$expr = { $gt: [{ $subtract: ["$totalReceived", "$totalSold"] }, 0] };
    if (expiresBefore) filter.expiryAt = { $lte: new Date(expiresBefore) };

    const meds = await Medicine.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-costPrice -totalReceived -totalSold -__v");

    const count = await Medicine.countDocuments(filter);

    res.json({ items: meds, total: count, page: Number(page), limit: Number(limit) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// READ PUBLIC (NO TOKEN)
export const getMedicine = async (req, res) => {
  try {
    const med = await Medicine.findById(req.params.id)
      .select("-costPrice -totalReceived -totalSold -__v");

    if (!med) return res.status(404).json({ message: "Topilmadi" });

    res.json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateMedicine = async (req, res) => {
  try {
    const med = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!med) return res.status(404).json({ message: "Topilmadi" });

    res.json(med);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// DELETE
export const deleteMedicine = async (req, res) => {
  const med = await Medicine.findByIdAndDelete(req.params.id);
  if (!med) return res.status(404).json({ message: "Topilmadi" });
  res.json({ success: true });
};

// RECEIVE STOCK
export const receiveStock = async (req, res) => {
  const { qty = 0, note } = req.body;

  if (qty <= 0) return res.status(400).json({ message: "qty > 0 bo‘lishi kerak" });

  const med = await Medicine.findById(req.params.id);
  if (!med) return res.status(404).json({ message: "Topilmadi" });

  const before = med.currentStock;
  med.totalReceived += Number(qty);
  await med.save();

  await StockHistory.create({
    medicine: med._id,
    type: "receive",
    qty,
    beforeStock: before,
    afterStock: med.currentStock,
    unitCost: med.costPrice,
    note
  });

  res.json({ success: true, currentStock: med.currentStock, item: med });
};

// SELL STOCK
export const sellStock = async (req, res) => {
  const { qty = 0, note } = req.body;

  if (qty <= 0) return res.status(400).json({ message: "qty > 0 bo‘lishi kerak" });

  const med = await Medicine.findById(req.params.id);
  if (!med) return res.status(404).json({ message: "Topilmadi" });

  if (med.totalSold + Number(qty) > med.totalReceived) {
    return res.status(400).json({ message: "Qoldiq yetarli emas" });
  }

  const before = med.currentStock;
  med.totalSold += Number(qty);
  await med.save();

  await StockHistory.create({
    medicine: med._id,
    type: "sell",
    qty,
    beforeStock: before,
    afterStock: med.currentStock,
    unitPrice: med.sellPrice,
    unitCost: med.costPrice,
    note
  });

  res.json({ success: true, currentStock: med.currentStock, item: med });
};

// GET EXPIRING SOON
export const getExpiringSoon = async (req, res) => {
  try {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const meds = await Medicine.find({
      expiryAt: { $lte: nextMonth, $gte: today },
    }).select("-costPrice -totalReceived -totalSold -__v");

    res.json({ success: true, count: meds.length, items: meds });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET EXPIRED MEDICINES
export const getExpiredMedicines = async (req, res) => {
  try {
    const today = new Date();
    const { includeZeroStock = "false", page = 1, limit = 20 } = req.query;

    const filter = { expiryAt: { $lt: today } };

    if (includeZeroStock !== "true") {
      filter.$expr = { $gt: [{ $subtract: ["$totalReceived", "$totalSold"] }, 0] };
    }

    const items = await Medicine.find(filter)
      .sort({ expiryAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-costPrice -totalReceived -totalSold -__v");

    const total = await Medicine.countDocuments(filter);

    res.json({ success: true, total, page, limit, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

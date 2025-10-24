import Medicine from "../models/Medicine.js";
import StockHistory from "../models/StockHistory.js";

// CREATE
export const createMedicine = async (req, res) => {
    try {
        const med = await Medicine.create(req.body);
        res.status(201).json(med);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};





export const listMedicines = async (req, res) => {
    try {
        const { q, company, inStock, expiresBefore, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (q) filter.$text = { $search: q };
        if (company) filter.company = company;
        if (inStock === "true") filter.$expr = { $gt: [{ $subtract: ["$totalReceived", "$totalSold"] }, 0] };
        if (expiresBefore) filter.expiryAt = { $lte: new Date(expiresBefore) };

        const meds = await Medicine
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const count = await Medicine.countDocuments(filter);
        res.json({ items: meds, total: count, page: Number(page), limit: Number(limit) });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// READ by id
export const getMedicine = async (req, res) => {
    const med = await Medicine.findById(req.params.id);
    if (!med) return res.status(404).json({ message: "Topilmadi" });
    res.json(med);
};

// UPDATE
export const updateMedicine = async (req, res) => {
    try {
        const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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

// STOCK: kirim (olib kelish)
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
        qty: Number(qty),
        beforeStock: before,
        afterStock: med.currentStock,
        unitCost: med.costPrice,
        note
    });

    res.json({ success: true, currentStock: med.currentStock, item: med });
};
export const getExpiringSoon = async (req, res) => {
  try {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30); // 30 kun ichida tugaydiganlar

    const meds = await Medicine.find({
      expiryAt: { $lte: nextMonth, $gte: today },
    });

    res.json({
      success: true,
      count: meds.length,
      items: meds,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// MUDDATIDAN O'TGAN DORILAR
export const getExpiredMedicines = async (req, res) => {
  try {
    const today = new Date();
    const { includeZeroStock = "false", page = 1, limit = 20 } = req.query;

    // expiryAt bugundan kichik bo'lganlar
    const filter = { expiryAt: { $lt: today } };

    // default: qoldig'i bor (stock > 0) dorilarni ko'rsatamiz
    if (includeZeroStock !== "true") {
      filter.$expr = { $gt: [{ $subtract: ["$totalReceived", "$totalSold"] }, 0] };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const items = await Medicine.find(filter)
      .sort({ expiryAt: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Medicine.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      items,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


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
    qty: Number(qty),
    beforeStock: before,
    afterStock: med.currentStock,
    unitPrice: med.sellPrice,
    unitCost: med.costPrice,
    note
  });

  res.json({ success: true, currentStock: med.currentStock, item: med });
};


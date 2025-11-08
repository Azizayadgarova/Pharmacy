import Order from "../models/Order.js";
import Medicine from "../models/Medicine.js";

// 🛒 Yangi buyurtma yaratish
export const createOrder = async (req, res) => {
  try {
    const { customerName, phone, address, items, notes } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "Buyurtma bo‘sh bo‘lishi mumkin emas" });

    // Dori mavjudligini va zaxiradan chiqimini tekshirish
    let totalAmount = 0;
    for (const it of items) {
      const med = await Medicine.findById(it.medicine);
      if (!med) throw new Error(`Dori topilmadi: ${it.medicine}`);
      if (med.currentStock < it.quantity)
        throw new Error(`Yetarli qoldiq yo‘q: ${med.name}`);

      totalAmount += it.sellPrice * it.quantity;
      med.totalSold += it.quantity;
      await med.save();
    }

    const order = await Order.create({
      customerName,
      phone,
      address,
      items,
      totalAmount,
      notes,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Order create error:", err);
    res.status(400).json({ message: err.message });
  }
};

// 📋 Barcha buyurtmalar
export const getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate("items.medicine", "name company");
  res.json({ success: true, count: orders.length, items: orders });
};

// 🧾 Bitta buyurtma
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.medicine", "name company");
  if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });
  res.json(order);
};

// 🔄 Holatini yangilash
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });

  order.status = req.body.status || order.status;
  await order.save();

  res.json({ success: true, order });
};

// ❌ O‘chirish
export const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });
  res.json({ success: true, message: "Buyurtma o‘chirildi" });
};

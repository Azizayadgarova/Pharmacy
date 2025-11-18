import Advertisement from "../models/Advertisement.js";

// CREATE — Reklama qo‘shish
export const createAd = async (req, res) => {
  try {
    const { img, title, description } = req.body;

    const ad = await Advertisement.create({ img, title, description });

    res.status(201).json({ success: true, ad });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET ALL — barcha reklamalar
export const getAds = async (req, res) => {
  try {
    const ads = await Advertisement.find().sort({ createdAt: -1 });
    res.json({ success: true, items: ads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE — bitta reklamani o‘chirish
export const deleteAd = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ message: "Reklama topilmadi" });

    res.json({ success: true, message: "Reklama o‘chirildi" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

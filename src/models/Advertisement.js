import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    img: { type: String, required: true }, // rasm URL
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Advertisement", advertisementSchema);

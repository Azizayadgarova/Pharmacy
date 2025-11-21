import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db.js";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import setupSwagger from "./swagger.js";
import utilsRoutes from "./routes/utilsRoutes.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // 🔹 avval app ni yaratish kerak

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/utils", utilsRoutes);


// 🔹 Swagger setup
setupSwagger(app); // endi chaqirilsa bo‘ladi

// 🔹 API root
app.use("/api", routes);

// 🔹 404 uchun
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// 🔹 Serverni ishga tushirish
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`✅ Server http://localhost:${PORT} da ishlayapti`)))
  .catch((e) => {
    console.error("❌ DB ulanish xatosi:", e);
    process.exit(1);
  });

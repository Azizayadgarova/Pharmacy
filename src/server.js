import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db.js";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// API root
app.use("/api", routes);

// 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server http://localhost:${PORT} da ishlayapti`)))
  .catch((e) => {
    console.error("DB ulanish xatosi:", e);
    process.exit(1);
  });

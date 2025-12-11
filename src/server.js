import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db.js";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import setupSwagger from "./swagger.js";
import http from "http";
import { Server as SocketServer } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, { cors: { origin: "*" } });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Swagger
setupSwagger(app);

// API root
app.use("/api", routes);

// 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Yangi klient ulandi:", socket.id);
});

// Buyurtma qo‘shilganda socket emit qilish
app.post("/api/orders/new", async (req, res) => {
  try {
    const newOrder = req.body;

    // DB saqlash kodi bo‘lishi kerak
    // const savedOrder = await Order.create(newOrder);

    io.emit("newOrder", newOrder); // barcha ulanagan klientlarga yuborish
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Xatolik" });
  }
});

// Server port
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI)
  .then(() => server.listen(PORT, () => console.log(`✅ Server http://localhost:${PORT} da ishlayapti`)))
  .catch((e) => {
    console.error("❌ DB ulanish xatosi:", e);
    process.exit(1);
  });

export { io };

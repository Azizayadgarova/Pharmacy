import { Router } from "express";
import medicinesRouter from "./medicines.js";
// import authRouter from "./auth.js"; // keyin kerak bo'lsa ulaysan

const r = Router();

r.use("/medicines", medicinesRouter);
// r.use("/auth", authRouter);

export default r;

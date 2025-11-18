import { Router } from "express";
import medicinesRouter from "./medicines.js";
import authRouter from "./auth.js";
import ordersRouter from "./orders.js";
import advertisementsRouter from "./advertisements.js";

const r = Router();
r.use("/auth", authRouter);
r.use("/medicines", medicinesRouter);
r.use("/orders", ordersRouter);
r.use("/ads", advertisementsRouter);

export default r;

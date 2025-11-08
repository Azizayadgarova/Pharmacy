import { Router } from "express";
import medicinesRouter from "./medicines.js";
import authRouter from "./auth.js";
import ordersRouter from "./orders.js";

const r = Router();
r.use("/auth", authRouter);
r.use("/medicines", medicinesRouter);
r.use("/orders", ordersRouter);

export default r;

import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // Frontend header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token topilmadi yoki noto‘g‘ri format" });
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET || "defaultsecret";
    const decoded = jwt.verify(token, secret);

    req.admin = decoded; // decoded.id va decoded.username mavjud
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Noto‘g‘ri token yoki token muddati tugagan" });
  }
};

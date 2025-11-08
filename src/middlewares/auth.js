// src/middleware/auth.js
export const protect = (req, res, next) => {
  console.log("Protect middleware called");
  // Hozcha barcha so'rovlarni ruxsat beradi
  next();
};

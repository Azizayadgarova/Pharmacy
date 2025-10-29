  import multer from "multer";
  import path from "path";

  // Saqlash konfiguratsiyasi
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // loyihaning root/uploads papkasi
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
      cb(null, `${Date.now()}-${base}${ext}`);
    },
  });

  // File filter: faqat rasm turlari
  function fileFilter(req, file, cb) {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("F faqat rasm (jpeg, jpg, png, webp) qabul qilinadi"), false);
    }
  }

  export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
  });

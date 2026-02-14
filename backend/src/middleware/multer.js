import multer from "multer";
import path from "path";
import fs from "fs";

// ensure uploads folder exists
const uploadDirectory = "uploads";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// storage config
const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const fileExtension = path.extname(file.originalname);

    const safeFileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;

    cb(null, safeFileName);
  },
});

// multer middleware
const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;

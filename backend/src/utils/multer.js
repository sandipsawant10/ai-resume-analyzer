import multer from "multer";
import path from "path";
import fs from "fs";

// ensure uploads folder exists
const uploadDirectory = "uploads";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// storage config
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (request, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const fileExtension = path.extname(file.originalname);

    const safeFileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;

    callback(null, safeFileName);
  },
});

// multer middleware
const upload = multer({
  storage: storage,

  fileFilter: (request, file, callback) => {
    if (file.mimetype === "application/pdf") {
      callback(null, true);
    } else {
      callback(new Error("Only PDF files are allowed"));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;

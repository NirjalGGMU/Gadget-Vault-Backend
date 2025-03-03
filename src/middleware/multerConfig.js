import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads folder created.");
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExt = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
  },
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg", 
    "image/png", 
    "image/gif", 
    "image/webp",
    "application/pdf"
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Allowed types: JPEG, PNG, GIF, WebP, PDF"), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
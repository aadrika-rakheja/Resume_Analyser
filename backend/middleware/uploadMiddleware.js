import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads folder exists
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// We use memory storage so the server can inspect/parse the buffer directly, 
// then optionally write it to disk or process it without leaving orphaned temp files.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|docx|msword|vnd.openxmlformats-officedocument.wordprocessingml.document/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF and DOCX files are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

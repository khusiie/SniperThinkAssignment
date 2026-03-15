import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFile, getJobStatus } from '../controllers/file.controller';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only images, PDFs, and text files are allowed!'));
  }
});

// POST /api/upload - Handle file upload
router.post('/upload', upload.single('file'), uploadFile);

// GET /api/job/:id - Get job status and results
router.get('/job/:id', getJobStatus);

export default router;

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const path    = require('path');
const fs      = require('fs');
const multer  = require('multer');       // ← moved to top
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));                                     // ← properly closed here
app.use(express.json());
app.use(morgan('dev'));

// Create uploads folder if missing
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => cb(null, `${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

// Step 4 — Upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('File received:', req.file.originalname);
    console.log('File type:', req.file.mimetype);

    return res.status(200).json({
      message:      'File uploaded successfully',
      filename:     req.file.filename,
      originalName: req.file.originalname,
      mimetype:     req.file.mimetype,
      size:         req.file.size,
      url:          `/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE')
      return res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Replace the simple cors() call with:
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods:['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
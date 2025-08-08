// routes/uploadRoute.js
const express = require('express');
const multer = require('multer');
const path = require('path');

module.exports = function (UPLOAD_DIR) {
  const router = express.Router();

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.resolve(process.cwd(), 'public', 'uploads')),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
      cb(null, name);
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) return cb(new Error('Type non autorisé'));
      cb(null, true);
    }
  });

  router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier' });
    res.json({ url: `/uploads/${req.file.filename}`, name: req.file.originalname });
  });

  return router;
};
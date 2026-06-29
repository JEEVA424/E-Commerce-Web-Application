// routes/upload.routes.js
const express = require('express');
const { uploadImage } = require('../controllers/upload.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const upload = require('../config/multer');

const router = express.Router();

router.post('/image', protect, adminOnly, upload.single('image'), uploadImage);

module.exports = router;

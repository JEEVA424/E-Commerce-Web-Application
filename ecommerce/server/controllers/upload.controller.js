// controllers/upload.controller.js
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, message: 'Image uploaded', data: { url: imageUrl, filename: req.file.filename } });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };

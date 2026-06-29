// routes/product.routes.js
const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getBrands } = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', getProducts);
router.get('/brands', getBrands);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, upload.single('image'), createProduct);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;

// routes/admin.routes.js
const express = require('express');
const { getDashboard, getAllOrders, updateOrderStatus, getAllUsers } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect, adminOnly);
router.get('/dashboard', getDashboard);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/users', getAllUsers);

module.exports = router;

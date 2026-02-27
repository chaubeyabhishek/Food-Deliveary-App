const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
} = require('../controllers/order.controller');

router.post('/', protect, placeOrder);
router.get('/user', protect, getUserOrders);
router.get('/admin', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;

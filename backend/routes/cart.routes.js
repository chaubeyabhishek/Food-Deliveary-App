const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cart.controller');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/clear', protect, clearCart);
router.delete('/remove/:foodId', protect, removeFromCart);

module.exports = router;

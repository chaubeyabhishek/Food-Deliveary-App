const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    createFood,
    getFoodsByRestaurant,
    updateFood,
    deleteFood,
} = require('../controllers/food.controller');

router.get('/:restaurantId', getFoodsByRestaurant);
router.post('/:restaurantId', protect, adminOnly, upload.single('image'), createFood);
router.put('/:id', protect, adminOnly, upload.single('image'), updateFood);
router.delete('/:id', protect, adminOnly, deleteFood);

module.exports = router;

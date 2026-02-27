const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    createRestaurant,
    getRestaurants,
    getRestaurant,
    updateRestaurant,
    deleteRestaurant,
} = require('../controllers/restaurant.controller');

router.get('/', getRestaurants);
router.get('/:id', getRestaurant);
router.post('/', protect, adminOnly, upload.single('image'), createRestaurant);
router.put('/:id', protect, adminOnly, upload.single('image'), updateRestaurant);
router.delete('/:id', protect, adminOnly, deleteRestaurant);

module.exports = router;

const FoodItem = require('../models/FoodItem');
const path = require('path');

const parseBool = (val) => val === true || val === 'true';

const getImageUrl = (file, req) => {
    if (!file) return null;
    if (file.path && file.path.startsWith('http')) return file.path;
    const filename = path.basename(file.path || file.filename);
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// @desc Create food item
// @route POST /api/foods/:restaurantId
const createFood = async (req, res) => {
    try {
        const { name, price, category, description, isAvailable, imageUrl } = req.body;
        const image = req.file ? getImageUrl(req.file, req) : (imageUrl || '');
        const food = await FoodItem.create({
            restaurantId: req.params.restaurantId,
            name, image, price, category, description,
            isAvailable: parseBool(isAvailable),
        });
        res.status(201).json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get food items by restaurant
// @route GET /api/foods/:restaurantId
const getFoodsByRestaurant = async (req, res) => {
    try {
        const foods = await FoodItem.find({ restaurantId: req.params.restaurantId });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update food item
// @route PUT /api/foods/:id
const updateFood = async (req, res) => {
    try {
        const { name, price, category, description, isAvailable, imageUrl } = req.body;
        const updateData = { name, price, category, description, isAvailable: parseBool(isAvailable) };
        if (req.file) updateData.image = getImageUrl(req.file, req);
        else if (imageUrl) updateData.image = imageUrl;

        const food = await FoodItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!food) return res.status(404).json({ message: 'Food item not found' });
        res.json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete food item
// @route DELETE /api/foods/:id
const deleteFood = async (req, res) => {
    try {
        const food = await FoodItem.findByIdAndDelete(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food item not found' });
        res.json({ message: 'Food item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createFood, getFoodsByRestaurant, updateFood, deleteFood };

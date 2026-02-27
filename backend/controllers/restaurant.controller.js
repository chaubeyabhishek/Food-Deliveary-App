const Restaurant = require('../models/Restaurant');
const path = require('path');

// Helper: parse isActive/isAvailable from FormData string
const parseActive = (val) => val === true || val === 'true';

// Build a public-accessible URL for an uploaded file
// Cloudinary gives a full https URL; local disk gives an absolute path
const getImageUrl = (file, req) => {
    if (!file) return null;
    // Cloudinary: already a full URL
    if (file.path && file.path.startsWith('http')) return file.path;
    // Local disk: build URL from filename
    const filename = path.basename(file.path || file.filename);
    const proto = req.protocol;
    const host = req.get('host');
    return `${proto}://${host}/uploads/${filename}`;
};

// @desc  Create restaurant
// @route POST /api/restaurants
const createRestaurant = async (req, res) => {
    try {
        const { name, description, address, isActive, imageUrl } = req.body;
        const image = req.file ? getImageUrl(req.file, req) : (imageUrl || '');
        const restaurant = await Restaurant.create({
            name,
            image,
            description,
            address,
            isActive: parseActive(isActive),
        });
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all restaurants
// @route GET /api/restaurants
const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get single restaurant
// @route GET /api/restaurants/:id
const getRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update restaurant
// @route PUT /api/restaurants/:id
const updateRestaurant = async (req, res) => {
    try {
        const { name, description, address, isActive, imageUrl } = req.body;
        const updateData = { name, description, address, isActive: parseActive(isActive) };
        if (req.file) updateData.image = getImageUrl(req.file, req);
        else if (imageUrl) updateData.image = imageUrl;

        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete restaurant
// @route DELETE /api/restaurants/:id
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json({ message: 'Restaurant deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createRestaurant, getRestaurants, getRestaurant, updateRestaurant, deleteRestaurant };

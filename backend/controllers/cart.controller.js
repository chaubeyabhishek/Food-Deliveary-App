const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');

// Helper to recalculate total
const recalcTotal = async (cart) => {
    await cart.populate('items.foodId');
    let total = 0;
    for (const item of cart.items) {
        if (item.foodId && item.foodId.price) {
            total += item.foodId.price * item.quantity;
        }
    }
    cart.total = parseFloat(total.toFixed(2));
    return cart;
};


const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');
        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [], total: 0 });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Add / update item in cart
// @route POST /api/cart/add
const addToCart = async (req, res) => {
    try {
        const { foodId, quantity } = req.body;
        const food = await FoodItem.findById(foodId);
        if (!food) return res.status(404).json({ message: 'Food item not found' });

        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) cart = new Cart({ userId: req.user._id, items: [] });

        const existingItem = cart.items.find((i) => i.foodId.toString() === foodId);
        if (existingItem) {
            existingItem.quantity = quantity != null ? quantity : existingItem.quantity + 1;
        } else {
            cart.items.push({ foodId, quantity: quantity || 1 });
        }

        await recalcTotal(cart);
        await cart.save();
        await cart.populate('items.foodId');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Remove item from cart
// @route DELETE /api/cart/remove/:foodId
const removeFromCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter((i) => i.foodId.toString() !== req.params.foodId);
        await recalcTotal(cart);
        await cart.save();
        await cart.populate('items.foodId');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Clear cart
// @route DELETE /api/cart/clear
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.user._id },
            { items: [], total: 0 },
            { new: true }
        );
        res.json(cart || { items: [], total: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };

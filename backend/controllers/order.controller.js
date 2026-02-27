const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc Place an order
// @route POST /api/orders
const placeOrder = async (req, res) => {
    try {
        const { deliveryAddress, paymentMethod } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const orderItems = cart.items.map((item) => ({
            foodId: item.foodId._id,
            name: item.foodId.name,
            price: item.foodId.price,
            quantity: item.quantity,
            image: item.foodId.image,
        }));

        const order = await Order.create({
            userId: req.user._id,
            items: orderItems,
            total: cart.total,
            deliveryAddress,
            paymentMethod: paymentMethod || 'COD',
        });

        // Clear cart after placing order
        await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [], total: 0 });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get logged-in user orders
// @route GET /api/orders/user
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all orders (Admin)
// @route GET /api/orders/admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update order status (Admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'preparing', 'out for delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
        }
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('userId', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus };

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/restaurants', require('./routes/restaurant.routes'));
app.use('/api/foods', require('./routes/food.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));

app.get('/', (req, res) => res.json({ message: 'Food App API Running' }));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Connecting to MongoDB: ${process.env.MONGO_URI?.substring(0, 40)}...`);
    try {
        await connectDB();
    } catch (err) {
        console.error('MongoDB connection FAILED:', err.message);
        console.error('Tip: Check Atlas IP whitelist - add 0.0.0.0/0 to allow all IPs');
    }
});

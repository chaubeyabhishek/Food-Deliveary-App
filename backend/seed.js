const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');

const restaurants = [
    {
        name: 'Spice Garden',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
        description: 'Authentic North Indian cuisine with rich gravies and tandoor specialties',
        address: 'Connaught Place, New Delhi',
        isActive: true,
    },
    {
        name: 'South Spice House',
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80',
        description: 'Traditional South Indian flavors — dosas, idlis, sambhar and more',
        address: 'Jayanagar, Bengaluru',
        isActive: true,
    },
    {
        name: 'Biryani Bros',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
        description: 'Slow-cooked Hyderabadi & Lucknawi biryani with authentic dum cooking',
        address: 'Banjara Hills, Hyderabad',
        isActive: true,
    },
    {
        name: 'Burger Republic',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        description: 'Gourmet burgers crafted with fresh ingredients and house sauces',
        address: 'Koregaon Park, Pune',
        isActive: true,
    },
    {
        name: 'Pizza Fiesta',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        description: 'Wood-fired pizzas with classic Italian toppings and Indian fusion flavors',
        address: 'Bandra West, Mumbai',
        isActive: true,
    },
    {
        name: 'Mithai & Snacks Corner',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
        description: 'Fresh Indian sweets, chaats, and snacks made with traditional recipes',
        address: 'MG Road, Jaipur',
        isActive: true,
    },
    {
        name: 'Chill & Scoop 🍦',
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80',
        description: 'Premium ice creams, gelatos, sundaes, and frozen desserts for every craving',
        address: 'Indiranagar, Bengaluru',
        isActive: true,
    },
];

const getFoodItems = (restaurantId, restaurantName) => {
    const menus = {
        'Spice Garden': [
            { name: 'Butter Chicken', price: 280, category: 'Main Course', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80' },
            { name: 'Paneer Tikka', price: 220, category: 'Starters', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80' },
            { name: 'Dal Makhani', price: 180, category: 'Main Course', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80' },
            { name: 'Garlic Naan', price: 50, category: 'Bread', image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=500&q=80' },
            { name: 'Chicken Tikka Masala', price: 300, category: 'Main Course', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80' },
            { name: 'Palak Paneer', price: 200, category: 'Main Course', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80' },
            { name: 'Shahi Tukda', price: 120, category: 'Dessert', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80' },
            { name: 'Mango Lassi', price: 80, category: 'Beverages', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80' },
        ],
        'South Spice House': [
            { name: 'Masala Dosa', price: 120, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80' },
            { name: 'Idli Sambhar', price: 80, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80' },
            { name: 'Vada', price: 60, category: 'Starters', image: 'https://images.unsplash.com/photo-1630409351241-e90e7d6b674c?w=500&q=80' },
            { name: 'Uttapam', price: 100, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&q=80' },
            { name: 'Chettinad Chicken Curry', price: 260, category: 'Main Course', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80' },
            { name: 'Kerala Fish Curry', price: 280, category: 'Main Course', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80' },
            { name: 'Filter Coffee', price: 50, category: 'Beverages', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80' },
            { name: 'Payasam', price: 90, category: 'Dessert', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80' },
        ],
        'Biryani Bros': [
            { name: 'Hyderabadi Chicken Biryani', price: 320, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80' },
            { name: 'Mutton Biryani', price: 380, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80' },
            { name: 'Veg Biryani', price: 220, category: 'Biryani', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80' },
            { name: 'Egg Biryani', price: 240, category: 'Biryani', image: 'https://images.unsplash.com/photo-1512058454905-6b841e7ad132?w=500&q=80' },
            { name: 'Chicken 65', price: 200, category: 'Starters', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80' },
            { name: 'Mirchi Ka Salan', price: 100, category: 'Sides', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80' },
            { name: 'Double Ka Meetha', price: 110, category: 'Dessert', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80' },
            { name: 'Raita', price: 60, category: 'Sides', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80' },
        ],
        'Burger Republic': [
            { name: 'Classic Chicken Burger', price: 180, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
            { name: 'BBQ Beef Burger', price: 220, category: 'Burgers', image: 'https://images.unsplash.com/photo-1561235111-11edd8e33b8f?w=500&q=80' },
            { name: 'Veg Aloo Tikki Burger', price: 140, category: 'Burgers', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&q=80' },
            { name: 'Loaded Cheese Fries', price: 130, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80' },
            { name: 'Onion Rings', price: 100, category: 'Sides', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80' },
            { name: 'Chocolate Milkshake', price: 150, category: 'Beverages', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80' },
            { name: 'Oreo Shake', price: 160, category: 'Beverages', image: 'https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=500&q=80' },
            { name: 'Double Patty Smash Burger', price: 280, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
        ],
        'Pizza Fiesta': [
            { name: 'Margherita Pizza', price: 250, category: 'Pizza', image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=500&q=80' },
            { name: 'Farmhouse Pizza', price: 320, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80' },
            { name: 'Chicken BBQ Pizza', price: 350, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
            { name: 'Paneer Tikka Pizza', price: 330, category: 'Pizza', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80' },
            { name: 'Garlic Bread', price: 120, category: 'Sides', image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=500&q=80' },
            { name: 'Pasta Arrabbiata', price: 200, category: 'Pasta', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80' },
            { name: 'Tiramisu', price: 180, category: 'Dessert', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80' },
            { name: 'Cold Coffee', price: 120, category: 'Beverages', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80' },
        ],
        'Mithai & Snacks Corner': [
            { name: 'Pani Puri (6 pcs)', price: 50, category: 'Chaat', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80' },
            { name: 'Bhel Puri', price: 60, category: 'Chaat', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80' },
            { name: 'Dahi Puri', price: 70, category: 'Chaat', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80' },
            { name: 'Aloo Tikki Chaat', price: 80, category: 'Chaat', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&q=80' },
            { name: 'Gulab Jamun (2 pcs)', price: 60, category: 'Sweets', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80' },
            { name: 'Rasgulla (2 pcs)', price: 55, category: 'Sweets', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80' },
            { name: 'Kaju Katli (100g)', price: 120, category: 'Sweets', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80' },
            { name: 'Samosa (2 pcs)', price: 30, category: 'Snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80' },
        ],
        'Chill & Scoop 🍦': [
            { name: 'Belgian Chocolate Scoop', price: 80, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80' },
            { name: 'Mango Sorbet', price: 70, category: 'Sorbet', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&q=80' },
            { name: 'Strawberry Gelato', price: 90, category: 'Gelato', image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=500&q=80' },
            { name: 'Classic Vanilla Sundae', price: 120, category: 'Sundae', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80' },
            { name: 'Hot Fudge Brownie Sundae', price: 180, category: 'Sundae', image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&q=80' },
            { name: 'Butterscotch Crunch Cone', price: 60, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80' },
            { name: 'Kesar Pista Kulfi', price: 70, category: 'Kulfi', image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=500&q=80' },
            { name: 'Blueberry Cheesecake Ice Cream', price: 110, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=500&q=80' },
        ],
    };

    return (menus[restaurantName] || []).map(item => ({
        ...item,
        restaurantId,
        isAvailable: true,
    }));
};

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    console.log('Cleared existing restaurants and food items');

    // Insert restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`Inserted ${createdRestaurants.length} restaurants`);

    // Insert food items for each
    for (const r of createdRestaurants) {
        const items = getFoodItems(r._id, r.name);
        await FoodItem.insertMany(items);
        console.log(`  → Added ${items.length} items for ${r.name}`);
    }

    console.log('\n✅ Seed complete!');
    process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });

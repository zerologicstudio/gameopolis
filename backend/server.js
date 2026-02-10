require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');
const menuRoutes = require('./routes/menu');
const galleryRoutes = require('./routes/gallery');
const settingsRoutes = require('./routes/settings');

// Import models for seeding
const MenuItem = require('./models/MenuItem');
const Gallery = require('./models/Gallery');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Gameopolis API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gameopolis')
.then(async () => {
    console.log('✅ Connected to MongoDB');

    // Seed initial data if collections are empty
    await seedInitialData();
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// Seed initial data
async function seedInitialData() {
    try {
        // Check if menu items exist
        const menuCount = await MenuItem.countDocuments();
        if (menuCount === 0) {
            console.log('📝 Seeding initial menu items...');
            const defaultMenuItems = [
                // Hot Beverages
                { name: 'Filter Coffee', price: 40, category: 'hot-beverages' },
                { name: 'Cappuccino', price: 60, category: 'hot-beverages' },
                { name: 'Masala Chai', price: 30, category: 'hot-beverages' },
                { name: 'Hot Chocolate', price: 50, category: 'hot-beverages' },
                // Cold Beverages
                { name: 'Fresh Lime Soda', price: 40, category: 'cold-beverages' },
                { name: 'Iced Tea', price: 50, category: 'cold-beverages' },
                { name: 'Milkshake (Chocolate/Vanilla)', price: 80, category: 'cold-beverages' },
                { name: 'Soft Drinks', price: 40, category: 'cold-beverages' },
                // Snacks
                { name: 'French Fries', price: 80, category: 'snacks' },
                { name: 'Samosa (2 pcs)', price: 40, category: 'snacks' },
                { name: 'Sandwich', price: 70, category: 'snacks' },
                { name: 'Nachos with Cheese', price: 100, category: 'snacks' },
                // Quick Meals
                { name: 'Maggi Noodles', price: 50, category: 'quick-meals' },
                { name: 'Pasta', price: 120, category: 'quick-meals' },
                { name: 'Mini Pizza', price: 150, category: 'quick-meals' }
            ];
            await MenuItem.insertMany(defaultMenuItems);
            console.log('✅ Menu items seeded successfully');
        }

        // Check if gallery images exist
        const galleryCount = await Gallery.countDocuments();
        if (galleryCount === 0) {
            console.log('📝 Seeding initial gallery images...');
            const defaultGalleryImages = [
                {
                    url: 'https://images.unsplash.com/photo-1610890716271-e2fe9e9c0c6d?w=400&h=300&fit=crop',
                    category: 'interior',
                    alt: 'Gameopolis Cafe Interior - Board game cafe atmosphere in T-Nagar Chennai',
                    order: 1
                },
                {
                    url: 'https://images.unsplash.com/photo-1611371805429-8b5961bef381?w=400&h=300&fit=crop',
                    category: 'games',
                    alt: 'Board Game Collection - Extensive library of board games at Gameopolis',
                    order: 2
                },
                {
                    url: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=300&fit=crop',
                    category: 'tables',
                    alt: 'Gaming Tables - Comfortable gaming tables for board game sessions',
                    order: 3
                },
                {
                    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
                    category: 'experience',
                    alt: 'Group Gaming - Friends enjoying board games together at Gameopolis',
                    order: 4
                },
                {
                    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
                    category: 'interior',
                    alt: 'Cafe Seating Area - Comfortable seating at Gameopolis board game cafe',
                    order: 5
                },
                {
                    url: 'https://images.unsplash.com/photo-1640537908168-a5d4d4e9e6e5?w=400&h=300&fit=crop',
                    category: 'games',
                    alt: 'Strategy Board Games - Collection of strategy games available at Gameopolis',
                    order: 6
                },
                {
                    url: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=400&h=300&fit=crop',
                    category: 'tables',
                    alt: 'Board Game Setup - Gaming table with board game ready to play',
                    order: 7
                },
                {
                    url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=300&fit=crop',
                    category: 'experience',
                    alt: 'Customer Experience - Social gaming experience at Gameopolis',
                    order: 8
                }
            ];
            await Gallery.insertMany(defaultGalleryImages);
            console.log('✅ Gallery images seeded successfully');
        }
    } catch (error) {
        console.error('❌ Error seeding initial data:', error);
    }
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

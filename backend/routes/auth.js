const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Admin credentials (in production, store in database)
const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'gameopolis123'
};

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide username and password'
        });
    }

    // Check credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Create JWT token
        const token = jwt.sign(
            { username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { username }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
});

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Private
router.get('/verify', (req, res) => {
    // Token is verified by auth middleware
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;

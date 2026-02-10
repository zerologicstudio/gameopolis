const express = require('express');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/settings
// @desc    Get settings (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // Create default settings if none exist
        if (!settings) {
            settings = new Settings();
            await settings.save();
        }

        res.json({
            success: true,
            settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   PUT /api/settings
// @desc    Update settings
// @access  Private (Admin)
router.put('/', auth, async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings(req.body);
        } else {
            Object.assign(settings, req.body);
        }

        await settings.save();

        res.json({
            success: true,
            message: 'Settings updated successfully',
            settings
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating settings',
            error: error.message
        });
    }
});

module.exports = router;

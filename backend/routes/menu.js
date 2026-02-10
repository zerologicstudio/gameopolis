const express = require('express');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/menu
// @desc    Get all menu items (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, available } = req.query;
        let query = {};

        if (category) query.category = category;
        if (available !== undefined) query.available = available === 'true';

        const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });
        
        // Group by category
        const groupedMenu = {
            'hot-beverages': [],
            'cold-beverages': [],
            'snacks': [],
            'quick-meals': []
        };

        menuItems.forEach(item => {
            if (groupedMenu[item.category]) {
                groupedMenu[item.category].push(item);
            }
        });

        res.json({
            success: true,
            count: menuItems.length,
            menu: groupedMenu
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            menuItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   POST /api/menu
// @desc    Create new menu item
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
    try {
        const menuItem = new MenuItem(req.body);
        await menuItem.save();

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            menuItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating menu item',
            error: error.message
        });
    }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item updated successfully',
            menuItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating menu item',
            error: error.message
        });
    }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;

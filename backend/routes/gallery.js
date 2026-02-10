const express = require('express');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/gallery
// @desc    Get all gallery images (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};

        if (category) query.category = category;

        const images = await Gallery.find(query).sort({ order: 1, createdAt: 1 });
        res.json({
            success: true,
            count: images.length,
            gallery: images
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/gallery/:id
// @desc    Get single gallery image
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.json({
            success: true,
            image
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   POST /api/gallery
// @desc    Add new gallery image
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
    try {
        const image = new Gallery(req.body);
        await image.save();

        res.status(201).json({
            success: true,
            message: 'Image added successfully',
            image
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error adding image',
            error: error.message
        });
    }
});

// @route   PUT /api/gallery/:id
// @desc    Update gallery image
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const image = await Gallery.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.json({
            success: true,
            message: 'Image updated successfully',
            image
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating image',
            error: error.message
        });
    }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const image = await Gallery.findByIdAndDelete(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.json({
            success: true,
            message: 'Image deleted successfully'
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

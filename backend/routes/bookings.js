const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        if (status) query.status = status;

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private (Admin)
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({ bookingId: req.params.id });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Public
router.post('/', async (req, res) => {
    try {
        // Generate booking ID
        const lastBooking = await Booking.findOne().sort({ createdAt: -1 });
        const lastId = lastBooking ? parseInt(lastBooking.bookingId.replace('BK', '')) : 0;
        const bookingId = 'BK' + String(lastId + 1).padStart(3, '0');

        const booking = new Booking({
            ...req.body,
            bookingId,
            status: 'pending'
        });

        await booking.save();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        const booking = await Booking.findOneAndUpdate(
            { bookingId: req.params.id },
            { status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating booking',
            error: error.message
        });
    }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOneAndDelete({ bookingId: req.params.id });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Booking deleted successfully'
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

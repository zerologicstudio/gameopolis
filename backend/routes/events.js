const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/events
// @desc    Get all events (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { status, type } = req.query;
        let query = {};

        if (status) query.status = status;
        if (type) query.type = type;

        const events = await Event.find(query).sort({ date: 1 });
        res.json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event updated successfully',
            event
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   PATCH /api/events/:id/register
// @desc    Register for event
// @access  Public
router.patch('/:id/register', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.registered >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Event is fully booked'
            });
        }

        event.registered += 1;
        await event.save();

        res.json({
            success: true,
            message: 'Registration successful',
            event
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

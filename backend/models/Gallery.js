const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['interior', 'games', 'tables', 'experience', 'food']
    },
    alt: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Gallery', gallerySchema);

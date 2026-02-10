const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    phone: {
        type: String,
        default: '+91 98765 43210'
    },
    email: {
        type: String,
        default: 'info@gameopolis.in'
    },
    address: {
        type: String,
        default: '123, Usman Road, T-Nagar, Chennai, Tamil Nadu 600017'
    },
    openingTime: {
        type: String,
        default: '11:00'
    },
    closingTime: {
        type: String,
        default: '22:00'
    },
    socialMedia: {
        instagram: {
            type: String,
            default: 'https://instagram.com/gameopolis'
        },
        facebook: {
            type: String,
            default: 'https://facebook.com/gameopolis'
        },
        twitter: {
            type: String,
            default: 'https://twitter.com/gameopolis'
        }
    },
    pricing: {
        wednesday: {
            type: Number,
            default: 99
        },
        weekday: {
            type: Number,
            default: 120
        },
        weekend: {
            type: Number,
            default: 140
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
settingsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Settings', settingsSchema);

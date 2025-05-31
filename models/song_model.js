const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    bio: { type: String, default: '' },

    artist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
        default: null
    },

    type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Type",
        default: null
    },

    duration: {
        type: Number,
        required: false
    },

    image: { type: String, default: '' },

    cover_url: { type: String, default: '' },

    created_time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Song', songSchema);

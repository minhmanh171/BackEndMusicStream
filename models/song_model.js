const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },

    artist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },

    album_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        required: true
    },

    type: {
        type: String,
        enum: ['POP', 'ROCK', 'BALLAD', 'RAP', 'EDM', 'OTHER'],
        default: 'OTHER'
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

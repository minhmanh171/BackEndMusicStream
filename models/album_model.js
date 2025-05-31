const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
    },
    release_date: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String,
        default: '',
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song',
        },
    ],
}, {
    versionKey: false,
});

module.exports = mongoose.model('Album', albumSchema);

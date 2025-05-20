const mongoose = require('mongoose');

const playHistorySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    song_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    },
    play_at: {
        type: Date,
        required: true
    }
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('PlayHistory', playHistorySchema);

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
    content: {
        type: String,
        required: true,
        trim: true
    },
    created_time: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('Comment', commentSchema);

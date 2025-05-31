const mongoose = require('mongoose');

const ChatBoxSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    replies: {
        type: String,
        required: true,
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('chatbox', ChatBoxSchema, 'chatboxs');

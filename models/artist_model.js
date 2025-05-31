const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: false // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('Artist', artistSchema);

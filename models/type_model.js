const mongoose = require('mongoose');

const SongTypeSchema = new mongoose.Schema({
    name_type: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Type', SongTypeSchema);

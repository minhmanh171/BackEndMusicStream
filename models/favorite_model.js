const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    song_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    create_time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', FavoriteSchema);

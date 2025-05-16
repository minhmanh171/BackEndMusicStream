const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    is_public: { type: Boolean, default: false },
    create_time: { type: Date, default: Date.now },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
});
const Playlist = mongoose.models.Playlist || mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;

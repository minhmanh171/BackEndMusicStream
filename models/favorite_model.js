import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
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
    create_time: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false,
    versionKey: false
});

export default mongoose.model('Favorite', favoriteSchema);

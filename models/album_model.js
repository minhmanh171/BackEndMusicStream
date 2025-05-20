import mongoose from 'mongoose';

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
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
}, {
    versionKey: false,
});

export default mongoose.model('Album', albumSchema);

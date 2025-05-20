const express = require('express');
const router = express.Router();
const Song = require('../models/song_model');

//get all songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find().populate('artist_id');
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//insert a song
router.post('/', async (req, res) => {
    try {
        const song = new Song(req.body);
        await song.save();
        res.status(201).json(song);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Ví dụ API: /api/search?q=troi
router.get('/search', async (req, res) => {
    const query = req.query.q || '';

    const songs = await Song.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { artist: { $regex: query, $options: 'i' } }
        ]
    });

    // const playlists = await Playlist.find({
    //     $or: [
    //         { name: { $regex: query, $options: 'i' } }
    //     ]
    // });

    res.json(songs);
});


router.get('/:id', async (req, res) => {
    try {

        const song = await Song.findById(req.params.id).populate('artist_id');

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        res.json(song); // Trả về thông tin bài hát gồm image và author
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});







module.exports = router;
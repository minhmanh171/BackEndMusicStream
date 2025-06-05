const express = require('express');
const router = express.Router();
const Song = require('../models/song_model');

//get all songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find().populate('artist_id').populate('type_id');
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

// Cập nhật bài hát
router.put('/:id', async (req, res) => {
    try {
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(song);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Xóa bài hát
router.delete('/:id', async (req, res) => {
    try {
        await Song.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});





// API tìm kiếm bài hát theo title, trả kèm artist và type
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });
        }

        const songs = await Song.find({
            title: { $regex: q, $options: 'i' }
        })
            .populate('artist_id') // lấy thông tin artist
            .populate('type_id'); // lấy thông tin type nếu có

        res.json(songs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

router.get('/:id', async (req, res) => {
    try {

        const song = await Song.findById(req.params.id).populate('artist_id');

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }
        res.json(song);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
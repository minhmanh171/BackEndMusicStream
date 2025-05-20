const express = require('express');
const router = express.Router();
const Artist = require('../models/artist_model');

// Tạo mới artist
router.post('/', async (req, res) => {
    try {
        const { name, bio, image } = req.body;

        if (!name) return res.status(400).json({ message: 'Tên ca sĩ là bắt buộc.' });

        const newArtist = new Artist({ name, bio, image });
        const savedArtist = await newArtist.save();

        res.status(201).json(savedArtist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy danh sách tất cả artist
router.get('/', async (req, res) => {
    try {
        const artists = await Artist.find();
        res.json(artists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy chi tiết artist theo ID
router.get('/:id', async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) return res.status(404).json({ message: 'Không tìm thấy ca sĩ.' });

        res.json(artist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

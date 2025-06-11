const express = require('express');
const router = express.Router();
const Artist = require('../models/artist_model');


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


router.get('/', async (req, res) => {
    try {
        const artists = await Artist.find();
        res.json(artists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedArtist = await Artist.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } 
        );
        if (!updatedArtist) return res.status(404).json({ message: 'Không tìm thấy nghệ sĩ' });
        res.json(updatedArtist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Artist.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy nghệ sĩ' });
        res.json({ message: 'Đã xóa nghệ sĩ' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });
        }
        const artist = await Artist.find({
            name: { $regex: q, $options: 'i' }
        })

        res.json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});


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

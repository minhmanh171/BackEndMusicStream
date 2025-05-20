const express = require('express');
const Album = require('../models/album_model.js');

const router = express.Router();

// GET /api/albums - Lấy danh sách album
router.get('/', async (req, res) => {
    try {
        const albums = await Album.find()
            .populate('artist_id', 'name'); // populate tên artist nếu có
        res.json(albums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/albums/:id - Lấy album theo id
router.get('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id)
            .populate('artist_id', 'name');
        if (!album) return res.status(404).json({ message: 'Album không tồn tại' });
        res.json(album);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/albums - Tạo album mới
router.post('/', async (req, res) => {
    const { title, artist_id, release_date, image } = req.body;
    const album = new Album({
        title,
        artist_id,
        release_date,
        image,
    });

    try {
        const newAlbum = await album.save();
        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/albums/:id - Cập nhật album
router.put('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) return res.status(404).json({ message: 'Album không tồn tại' });

        const { title, artist_id, release_date, image } = req.body;

        if (title !== undefined) album.title = title;
        if (artist_id !== undefined) album.artist_id = artist_id;
        if (release_date !== undefined) album.release_date = release_date;
        if (image !== undefined) album.image = image;

        const updatedAlbum = await album.save();
        res.json(updatedAlbum);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/albums/:id - Xóa album
router.delete('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) return res.status(404).json({ message: 'Album không tồn tại' });
        await album.remove();
        res.json({ message: 'Xóa album thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
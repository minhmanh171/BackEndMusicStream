const express = require('express');
const router = express.Router();
const SongType = require('../models/type_model'); // đường dẫn tới model bạn gửi ở trên

// GET /song-types - Lấy danh sách tất cả thể loại
router.get('/', async (req, res) => {
    try {
        const types = await SongType.find();
        res.json(types);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /song-types/:id - Lấy thể loại theo ID
router.get('/:id', async (req, res) => {
    try {
        const type = await SongType.findById(req.params.id);
        if (!type) return res.status(404).json({ message: 'Song type not found' });
        res.json(type);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /song-types - Thêm mới thể loại
router.post('/', async (req, res) => {
    try {
        const newType = new SongType({
            name_type: req.body.name_type
        });
        const saved = await newType.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /song-types/:id - Cập nhật thể loại
router.put('/:id', async (req, res) => {
    try {
        const updated = await SongType.findByIdAndUpdate(
            req.params.id,
            { name_type: req.body.name_type },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /song-types/:id - Xóa thể loại
router.delete('/:id', async (req, res) => {
    try {
        await SongType.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;

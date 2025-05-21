const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite_model');

// [POST] Thêm bài hát vào danh sách yêu thích
router.post('/', async (req, res) => {
    try {
        const { user_id, song_id, create_time } = req.body;

        const exists = await Favorite.findOne({ user_id, song_id });
        if (exists) {
            return res.status(400).json({ error: 'Bài hát đã được yêu thích' });
        }

        const newFavorite = new Favorite({
            user_id,
            song_id,
            create_time: create_time ? new Date(create_time) : new Date()
        });

        const saved = await newFavorite.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi thêm yêu thích', detail: err.message });
    }
});

// [GET] Lấy danh sách bài hát yêu thích của 1 người dùng
router.get('/user/:userId', async (req, res) => {
    try {
        const favorites = await Favorite.findOne({ user_id: req.params.userId }).populate('song_id');
        if (!favorites) {
            return res.status(404).json({ message: 'Không tìm thấy danh sách yêu thích' });
        }
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách yêu thích', detail: err.message });
    }
});


// [DELETE] Xóa bài hát khỏi danh sách yêu thích
router.delete('/', async (req, res) => {
    try {
        const { user_id, song_id } = req.body;
        const deleted = await Favorite.findOneAndDelete({ user_id, song_id });
        if (!deleted) {
            return res.status(404).json({ error: 'Không tìm thấy yêu thích cần xóa' });
        }
        res.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa yêu thích', detail: err.message });
    }
});

module.exports = router;

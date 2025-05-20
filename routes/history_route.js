const express = require('express');
const router = express.Router();
const PlayHistory = require('../models/histrory_model');

// [POST] Ghi lại một lượt nghe
router.post('/', async (req, res) => {
    try {
        const { user_id, song_id, play_at } = req.body;

        const history = new PlayHistory({
            user_id,
            song_id,
            play_at: play_at ? new Date(play_at) : new Date()
        });

        const saved = await history.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi ghi lịch sử nghe', detail: err.message });
    }
});

// [GET] Lấy lịch sử nghe của 1 người dùng
router.get('/user/:userId', async (req, res) => {
    try {
        const history = await PlayHistory.find({ user_id: req.params.userId })
            .sort({ play_at: -1 })
            .populate('song_id', 'title artist'); // tùy chọn nếu bạn có populate
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy lịch sử nghe', detail: err.message });
    }
});

// [GET] Lấy tất cả lịch sử nghe của 1 bài hát
router.get('/song/:songId', async (req, res) => {
    try {
        const history = await PlayHistory.find({ song_id: req.params.songId }).sort({ play_at: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy lịch sử bài hát', detail: err.message });
    }
});

module.exports = router;

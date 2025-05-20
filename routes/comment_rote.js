const express = require('express');
const router = express.Router();
const Comment = require('../models/comment_model');

// [POST] Tạo comment mới
router.post('/', async (req, res) => {
    try {
        const { user_id, song_id, content } = req.body;

        const newComment = new Comment({
            user_id,
            song_id,
            content,
            created_time: new Date()
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi tạo comment', detail: err.message });
    }
});

// [GET] Lấy tất cả comment của 1 bài hát
router.get('/song/:songId', async (req, res) => {
    try {
        const comments = await Comment.find({ song_id: req.params.songId }).sort({ created_time: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy comment', detail: err.message });
    }
});

// [DELETE] Xóa một comment
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Comment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Comment không tồn tại' });
        res.json({ message: 'Đã xóa comment' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa comment', detail: err.message });
    }
});

module.exports = router;

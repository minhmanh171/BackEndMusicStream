const express = require('express');
const router = express.Router();
const Playlist = require('../models/playList_model');

//  Tạo playlist mới
router.post('/', async (req, res) => {
    try {
        const newPlaylist = new Playlist({
            name: req.body.name,
            user_id: req.body.user_id,
            is_public: req.body.is_public,
            create_time: req.body.create_time || new Date(),
            songs: req.body.songs
        });

        const saved = await newPlaylist.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find().populate('songs').populate('user_id'); // Populate user_id with username and email
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  Lấy tất cả playlist công khai
router.get('/public', async (req, res) => {
    try {
        const playlists = await Playlist.find({ is_public: true }).populate('songs');

        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  Lấy playlist theo user_id
router.get('/user/:userId', async (req, res) => {
    try {
        const playlists = await Playlist.find({ user_id: req.params.userId }).populate('songs');
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  Lấy playlist theo id
router.get('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songs').populate('user_id');
        if (!playlist) return res.status(404).json({ message: 'Không tìm thấy playlist' });
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  Cập nhật playlist
router.put('/:id', async (req, res) => {
    try {
        const updated = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  Xoá playlist
router.delete('/:id', async (req, res) => {
    try {
        await Playlist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xoá playlist' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API tìm kiếm playlist theo name
router.get('/playlists/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });
        }

        const playlists = await Playlist.find({
            name: { $regex: q, $options: 'i' }
        })
            .populate('user_id', 'username email')  // populate thông tin user nếu muốn (thay đổi field theo schema user)
            .populate({
                path: 'songs',
                populate: {
                    path: 'artist_id type_id',
                    select: 'name'  // lấy tên artist và type cho bài hát
                }
            });

        res.json(playlists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});
module.exports = router;

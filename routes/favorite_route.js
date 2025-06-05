const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite_model');

const mongoose = require('mongoose');
router.post('/', async (req, res) => {
    try {
        const { user_id, song_id } = req.body;

        const userObjectId = new mongoose.Types.ObjectId(user_id);
        const songObjectId = new mongoose.Types.ObjectId(song_id);
        // Tìm bản ghi yêu thích của user
        let favorite = await Favorite.findOne({ user_id: userObjectId });
        if (favorite) {
            // Nếu đã có bài hát này trong danh sách thì trả lỗi
            if (favorite.song_id.includes(songObjectId)) {
                return res.status(400).json({ message: 'Bài hát đã được yêu thích' });
            }

            // Nếu chưa có, thêm vào mảng
            favorite.song_id.push(songObjectId);
            await favorite.save();
            return res.status(200).json({ message: 'Đã thêm bài hát vào danh sách yêu thích' });
        } else {
            // Nếu chưa có bản ghi yêu thích, tạo mới
            const newFavorite = new Favorite({
                user_id: userObjectId,
                song_id: [songObjectId]
            });
            await newFavorite.save();
            return res.status(201).json({ message: 'Đã tạo danh sách yêu thích mới' });
        }

    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi thêm yêu thích', detail: err.message });
    }
});
// [GET] Lấy danh sách bài hát yêu thích của 1 người dùng
router.get('/user/:userId', async (req, res) => {
    try {
        const favorites = await Favorite.findOne({ user_id: req.params.userId })
            .populate({
                path: 'song_id',
                populate: {
                    path: 'artist_id',
                    model: 'Artist'
                }
            });
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
        const updated = await Favorite.findOneAndUpdate(
            { user_id },
            { $pull: { song_id: song_id } },
            { new: true }
        );
        res.json({ updated });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa yêu thích', detail: err.message });
    }
});



module.exports = router;

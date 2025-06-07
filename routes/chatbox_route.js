const express = require('express');
const router = express.Router();
const ChatBox = require('../models/chatbox_model');
const Type = require('../models/type_model');
const Song = require('../models/song_model');
router.get('/', async (req, res) => {
    try {
        const data = await ChatBox.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST - Tạo mới từ khóa + phản hồi
router.post('/', async (req, res) => {
    try {
        const { keyword, replies } = req.body;
        const newItem = new ChatBox({ keyword, replies });
        const saved = await newItem.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// PUT - Cập nhật keyword hoặc reply theo ID
router.put('/:id', async (req, res) => {
    try {
        const updated = await ChatBox.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE - Xoá từ khóa theo ID
router.delete('/:id', async (req, res) => {
    try {
        await ChatBox.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// router.post('/query', async (req, res) => {
//     try {
//         const { query } = req.body;
//         if (!query || query.trim() === '') {
//             return res.status(400).json({ error: 'ko để trống' });
//         }
//         console.log("Query:", query);

//         const chatResults = await ChatBox.find({
//             keyword: { $regex: query, $options: 'i' }
//         });
//         console.log(chatResults)
//         if (chatResults.length > 0) {

//             return res.json({
//                 type: 'chatbox',
//                 replies: chatResults
//             });

//         }
//         // Nếu không tìm thấy chatbox, tìm thể loại và bài hát như trước
//         const matchedTypes = await Type.find({
//             name_type: { $regex: query, $options: 'i' },
//         });
//         const typeIds = matchedTypes.map((t) => t._id);
//         const matchedSongs = await Song.find({
//             $or: [
//                 { title: { $regex: query, $options: 'i' } },
//                 { type_id: { $in: typeIds } },
//             ],
//         });

//         // Trả kết quả bình thường
//         res.json({
//             type: 'music',
//             matchedSongs,
//             matchedTypes,
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Lỗi server' });
//     }
// });

router.post('/query', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Không để trống' });
        }

        console.log("Query:", query);

        // Tìm từ bảng ChatBox
        const chatResults = await ChatBox.find({
            keyword: { $regex: query, $options: 'i' }
        });

        // Tìm từ bảng Type
        const matchedTypes = await Type.find({
            name_type: { $regex: query, $options: 'i' },
        });

        // Lấy danh sách _id của thể loại
        const typeIds = matchedTypes.map((t) => t._id);

        // Tìm từ bảng Song (theo title hoặc thuộc loại vừa tìm được)
        const matchedSongs = await Song.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { type_id: { $in: typeIds } },
            ],
        });

        // Gộp tất cả vào response
        return res.json({
            chatResults,
            matchedSongs,
            matchedTypes
        });

    } catch (error) {
        console.error('Lỗi khi truy vấn:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

module.exports = router;
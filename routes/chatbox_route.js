const express = require('express');
const router = express.Router();
const ChatBox = require('../models/chatbox_model');
const Type = require('../models/type_model');
const Song = require('../models/song_model');
const Artist = require('../models/artist_model')
const Fuse = require('fuse.js');
router.get('/', async (req, res) => {
    try {
        const data = await ChatBox.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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




// router.post('/query', async (req, res) => {
//     try {
//         const { query } = req.body;

//         if (!query || query.trim() === '') {
//             return res.status(400).json({ error: 'Không để trống' });
//         }

//         console.log("Query:", query);

//         const chatResults = await ChatBox.find({
//             keyword: { $regex: query, $options: 'i' }
//         });



//         const matchedTypes = await Type.find({
//             name_type: { $regex: query, $options: 'i' },
//         });


//         const matchedArtist = await Artist.find({
//             name: { $regex: query, $options: 'i' },
//         });

//         // const typeIds = matchedTypes.map((t) => t._id);

//         const matchedSongs = await Song.find({
//             $or: [
//                 { title: { $regex: query, $options: 'i' } }
//             ],
//         });

//         return res.json({
//             chatResults,
//             matchedSongs,
//             matchedTypes,
//             matchedArtist
//         });

//     } catch (error) {
//         console.error('Lỗi khi truy vấn:', error);
//         res.status(500).json({ error: 'Lỗi server' });
//     }
// });


// router.post('/query', async (req, res) => {
//     try {
//         let { query } = req.body;

//         query = query.trim();


//         const tokens = query.split(/\s+/).map(word => escapeRegex(word));


//         function escapeRegex(text) {
//             return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
//         }

//         // Tạo điều kiện tìm kiếm theo OR với từng từ token
//         // Ví dụ: [{keyword: /ca/i}, {keyword: /sĩ/i}, {keyword: /hàn/i}, {keyword: /quốc/i}]
//         const timtheotu = (field) => {
//             return {
//                 $or: tokens.map(token => ({
//                     [field]: { $regex: token, $options: 'i' }
//                 }))
//             };
//         };

//         // Tìm chatResults theo từng từ trong keyword
//         const chatResults = await ChatBox.find(timtheotu('keyword'));

//         // Tìm matchedTypes theo từng từ trong name_type
//         const matchedTypes = await Type.find(timtheotu('name_type'));

//         // Tìm matchedArtist theo từng từ trong name
//         const matchedArtist = await Artist.find(timtheotu('name'));

//         // Tìm matchedSongs theo từng từ trong title
//         const matchedSongs = await Song.find(timtheotu('title'));

//         return res.json({
//             chatResults,
//             matchedSongs,
//             matchedTypes,
//             matchedArtist
//         });

//     } catch (error) {
//         console.error('Lỗi khi truy vấn:', error);
//         res.status(500).json({ error: 'Lỗi server' });
//     }
// });


module.exports = router;
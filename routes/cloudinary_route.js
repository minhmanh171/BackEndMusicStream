// routes/upload.js
const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Storage cho ảnh
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'image-uploads',
        resource_type: 'image',
        format: async () => 'png',
        public_id: (req, file) => file.originalname.split('.')[0],
    },
});
const uploadImage = multer({ storage: imageStorage });

// Storage cho MP3
const mp3Storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'mp3-uploads',
        resource_type: 'video', // Cloudinary sử dụng "video" cho mp3
        format: async () => 'mp3',
        public_id: (req, file) => file.originalname.split('.')[0],
    },
});
const uploadMp3 = multer({ storage: mp3Storage });

// Route upload ảnh
router.post('/upload-image', uploadImage.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Không có ảnh' });
    res.json({ url: req.file.path });
});

// Route upload MP3
router.post('/upload-mp3', uploadMp3.single('mp3'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Không có file MP3' });
    res.json({ url: req.file.path });
});

module.exports = router;

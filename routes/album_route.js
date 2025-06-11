const express = require('express');
const router = express.Router();
const Album = require('../models/album_model');
const { populate } = require('../models/playList_model');
const { model } = require('mongoose');

// GET all albums
router.get('/', async (req, res) => {
    try {
        const albums = await Album.find()
            .populate('artist_id') 
            .populate('songs');   
        res.json(albums);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const album = new Album({
        title: req.body.title,
        artist_id: req.body.artist_id,
        release_date: req.body.release_date,
        image: req.body.image,
        songs: req.body.songs
    });

    try {
        const newAlbum = await album.save();
        res.status(201).json(newAlbum);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});




//tim theo nghe si
router.get('/artist/:id', async (req, res) => {
    try {
        const albums = await Album.find({ artist_id: req.params.id }).populate('songs');
        res.json(albums);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, artist_id, release_date, image, songs } = req.body;

        const updatedAlbum = await Album.findByIdAndUpdate(
            req.params.id,
            {
                title,
                artist_id,
                release_date,
                image,
                songs,
            },
            { new: true }
        );

        if (!updatedAlbum) {
            return res.status(404).json({ message: 'Album not found' });
        }

        res.json(updatedAlbum);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const deletedAlbum = await Album.findByIdAndDelete(req.params.id);

        if (!deletedAlbum) {
            return res.status(404).json({ message: 'Album not found' });
        }
        res.json({ message: 'Album deleted successfully', album: deletedAlbum });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// API tìm kiếm album theo title
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });
        }
        const albums = await Album.find({
            title: { $regex: q, $options: 'i' }
        }).populate('artist_id').populate('songs');

        res.json(albums);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id)
            .populate('artist_id')
            .populate({
                path: 'songs',
                populate: {
                    path: 'artist_id',
                    model: 'Artist'
                }
            });
        if (!album) return res.status(404).json({ message: 'Album not found' });
        res.json(album);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;

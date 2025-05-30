const express = require('express');
const router = express.Router();
const User = require('../models/user_model');

//get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//insert a user
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Cập nhật người dùng theo ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-password');
        res.json({ message: 'Cập nhật thành công', user: updatedUser });
    } catch (err) {
        res.status(400).json({ error: 'Cập nhật thất bại' });
    }
});

// Xóa người dùng theo ID
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa người dùng thành công' });
    } catch (err) {
        res.status(400).json({ error: 'Xóa thất bại' });
    }
});

//check login
router.post('/check_login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({
                success: true,
                message: 'Login successful',
                __id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                created_time: user.created_time

            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

//check login admin
router.post('/check_login_admin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            if (user.role === 'admin') {
                res.json({
                    success: true,
                    message: 'Login successful',
                    __id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    created_time: user.created_time
                });
            } else {
                res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});




//check register
router.post('/check_signup', async (req, res) => {
    const { username, email } = req.body;
    try {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            // Kiểm tra cụ thể trùng username hay email
            let message = '';
            if (user.username === username) message = 'Username already exists';
            if (user.email === email) message = 'Email already exists';
            if (user.username === username && user.email === email) {
                message = 'Cả 2 bị trùng';
            }
            res.json({
                success: false,
                message
            });
        } else {
            res.json({
                success: true,
                message: 'Username and email are available'
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

//
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;